class EventsController < ApplicationController
  before_action :set_event, only: [:show, :update, :destroy]
  @@items_per_page = 25
  @@date_start = Time.zone.today()
  @@date_end = Time.zone.today()

  # GET /events
  def index
    @@date_where = nil
    @@send_count = false
    @@next_event = Event
      .where("events.start > '#{Time.zone.now()}' OR '#{Time.zone.now()}' BETWEEN events.start AND events.end")
      .order(:start)
      .first

    if params[:date_start] && params[:date_end]
      @@date_start = Time.zone.parse(params[:date_start])
      @@date_end = Time.zone.parse(params[:date_end])
      @@date_where = "events.start BETWEEN '#{@@date_start}' AND '#{@@date_end}'"
    end

    if params[:send_count]
      @@send_count = true
    end

    # By Category---------------------------------------------------------------
    if params[:category]
      count = 0
      if params[:category] == 'Production'
        if @@send_count
          count = Event
            .joins("JOIN places ON places.id = events.location_id")
            .where(@@date_where)
            .where("places.installation = false")
            .size
        end
        @events = Event
          .joins("JOIN places ON places.id = events.location_id")
          .where(@@date_where)
          .where("places.installation = false")
          .order(:start)
          .paginate(page: params[:page], per_page: @@items_per_page)
      elsif
        params[:category] == 'CATP' ||
        params[:category] == 'CANS' ||
        params[:category] == 'TANS' ||
        params[:category] == 'THC'

        short_name = params[:category]
        if @@send_count
          count = Event
            .joins("JOIN places on places.id = events.location_id")
            .where(@@date_where)
            .where("places.short_name = '#{short_name}'")
            .size
        end
        @events = Event
          .joins("JOIN places on places.id = events.location_id")
          .where(@@date_where)
          .where("places.short_name = '#{short_name}'")
          .order(:start)
          .paginate(page: params[:page], per_page: @@items_per_page)
      end

        render json: @events,
        meta: { count: count, next: @@next_event },
        include: '**'

    # By Query------------------------------------------------------------------
    elsif params[:q]
      count = 0
      page_num = params[:page].to_i
      offset = ( page_num - 1 ) * @@items_per_page

      query = "SELECT DISTINCT events.*
      FROM events
      LEFT OUTER JOIN clients ON clients.id = events.client_id
      LEFT OUTER JOIN companies ON companies.id = clients.company_id
      LEFT OUTER JOIN event_employees ON event_employees.event_id = events.id
      LEFT OUTER JOIN employees ON employees.id = event_employees.employee_id
      LEFT OUTER JOIN contacts clients_contacts ON clients_contacts.id = clients.contact_id
      LEFT OUTER JOIN contacts employees_contacts ON  employees_contacts.id = employees.contact_id
      LEFT OUTER JOIN email_addresses clients_email_addresses ON clients_email_addresses.contact_id = clients_contacts.id
      LEFT OUTER JOIN email_addresses employees_email_addresses ON employees_email_addresses.contact_id = employees_contacts.id
      LEFT OUTER JOIN places places_location ON places_location.id = events.location_id
      LEFT OUTER JOIN places places_call_location ON places_call_location.id = events.call_location_id
      WHERE "

      terms = params[:q].split
      terms.each do |term|
        query += "(clients_contacts.first_name LIKE '%#{term.capitalize}%'
        OR clients_contacts.last_name LIKE '%#{term.capitalize}%'
        OR employees_contacts.first_name LIKE '%#{term.capitalize}%'
        OR employees_contacts.last_name LIKE '%#{term.capitalize}%'
        OR companies.name LIKE '%#{term.capitalize}%'
        OR events.action LIKE '%#{term.capitalize}%'
        OR events.kind LIKE '%#{term.capitalize}%'
        OR events.description LIKE '%#{term.capitalize}%'
        OR events.tags LIKE '%#{term.capitalize}%'
        OR events.summary LIKE '%#{term.capitalize}%'
        OR events.summary LIKE '%#{term}%'
        OR places_location.name LIKE '%#{term.capitalize}%'
        OR places_location.short_name LIKE '%#{term}%'
        OR places_location.short_name LIKE '%#{term.upcase}%'
        OR places_call_location.name LIKE '%#{term.capitalize}%'
        OR places_call_location.short_name LIKE '%#{term}%'
        OR places_call_location.short_name LIKE '%#{term.upcase}%'
        OR clients_email_addresses.email_address LIKE '%#{term.downcase}%'
        OR clients_email_addresses.email_address LIKE '%#{term}%'
        OR employees_email_addresses.email_address LIKE '%#{term.downcase}%'
        OR employees_email_addresses.email_address LIKE '%#{term}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end

      if @@date_where
        query += " AND #{@@date_where}"
      end

      if @@send_count
        count = Event.find_by_sql(query).size
      end

      query += " ORDER BY events.start"
      query += " OFFSET #{offset} ROWS"
      query += " FETCH NEXT #{@@items_per_page} ROWS ONLY"

      @events = Event.find_by_sql(query)


      render json: @events, root: "events", meta: { count: count, next: @@next_event }, include: '**'

    # By Worker Email-----------------------------------------------------------
    elsif params[:email]
      count = 0
      email = params[:email]

      if @@send_count
        count = Event
        .joins(event_employees: [{employee: [{contact: :email_address }]}])
        .where("email_addresses.email_address LIKE '%#{email}%'")
        .size
      end

      @events = Event
      .joins(event_employees: [{employee: [{contact: :email_address }]}])
      .where("email_addresses.email_address LIKE '%#{email}%'")
      .order(start: :DESC)
      .paginate(page: params[:page], per_page: @@items_per_page)

      render json: @events,
      meta: { count: count, next: @@next_event },
      include: '**'

    # By client_id--------------------------------------------------------------
    elsif params[:client_id]
      count = 0
      if @@send_count
        count = Event
          .where( client_id: "#{params[:client_id]}" )
          .where(@@date_where)
          .size
      end
      @events = Event
        .where( client_id: "#{params[:client_id]}" )
        .where(@@date_where)
        .order(:start)
        .paginate(page: params[:page], per_page: @@items_per_page)


        render json: @events,
        meta: { count: count, next: @@next_event },
        include: '**'

    # By i_cal_UID----------------------------------------------------------------
    elsif params[:i_cal_UID]
      @event = Event.where( i_cal_UID: "#{params[:i_cal_UID]}").first
      render json: @event, include: '**'

    # --------------------------------------------------------------------------
    else
      count = 0

      if @@send_count
        count = Event
          .where(@@date_where)
          .size
      end

      @events = Event
        .where(@@date_where)
        .order(:start)
        .paginate(page: params[:page], per_page: @@items_per_page)


      render json: @events, meta: { count: count, next: @@next_event }, include: '**'
    end
  end

  # GET /events/1
  def show
    render json: @event, include: '**'
  end

  # POST /events
  def create
    @event = Event.new(event_params)

    if @event.save
      render json: @event, status: :created, location: @event, include: '**'
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/1
  def update
    if @event.update(event_params)
      render json: @event, include: '**'
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events
  def sync
    event_only_params = event_params.except(:event_employees_attributes)
    e_e_params = event_params.slice(:event_employees_attributes)[:event_employees_attributes]

    @event = Event.where(:i_cal_UID => params[:i_cal_UID]).first_or_create(event_params)

    @event.update(event_only_params)
    if e_e_params
      e_e_params.each do |p|
        worker = @event
          .event_employees
          .where( employee_id: p[:employee_id] )
          .first_or_create

        worker.update(p.except(:employee_id))
    end
    end

    render json: @event, include: '**'
  end

  # DELETE /events/1
  def destroy
    @event.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event
      @event = Event.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def event_params
      params.require(:event).permit(
        :action,
        :break,
        :break_start,
        :category,
        :call_location_id,
        :call_time,
        :client_id,
        :clock_out,
        :confirmation,
        :created_at,
        :creator_id,
        :date,
        :date_start,
        :date_end,
        :description,
        :driving_time,
        :end,
        :etag,
        :extendedProperties,
        :gc_id,
        :html_link,
        :i_cal_UID,
        :id,
        :kind,
        :location_id,
        :notes,
        :organizer,
        :reminders,
        :sequence,
        :start,
        :status,
        :send_count,
        :summary,
        :tags,
        :updated_at,
        event_employees_attributes:
        [
          :id,
          :confirmation,
          :paid?,
          :position,
          :rate,
          :clock_in,
          :clock_out,
          :break_minutes,
          :break?,
          :hourly?,
          :employee_id,
          :event_id
        ]
      )
    end
end
