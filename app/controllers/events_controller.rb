class EventsController < ApplicationController
  before_action :set_event, only: [:show, :update, :destroy]
  @@items_per_page = 25
  @@start = Time.zone.today()
  @@end = Time.zone.tomorrow() - 1

  # GET /events
  def index
    @@date_where = nil
    @@send_count = false
    @@next_event = Event
      .where("events.start > '#{Time.zone.now()}' OR '#{Time.zone.now()}' BETWEEN events.start AND events.end")
      .order(:start)
      .first

    if params[:start] && params[:end]
      @@start = Time.zone.parse(params[:start])
      @@end = Time.zone.parse(params[:end])
      @@date_where = "events.start BETWEEN '#{@@start}' AND '#{@@end}'"
    end

    if params[:send_count]
      @@send_count = params[:send_count]
    end

    if params[:items_per_page]
      @@items_per_page = params[:items_per_page]
    end

    # By Query------------------------------------------------------------------
    if params[:q]
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

      query += " ORDER BY events.start DESC"
      query += " OFFSET #{offset} ROWS"
      query += " FETCH NEXT #{@@items_per_page} ROWS ONLY"

      @events = Event.find_by_sql(query)


      render json: @events, root: "events", meta: { count: count, next: @@next_event }, include: '**'

    # By Worker Email-----------------------------------------------------------
    elsif params[:email]
      count = 0
      email = params[:email]
      query = "email_addresses.email_address LIKE '%#{email}%'"
      order = "events.start DESC"

      if params[:upcoming] && params[:in_progress]
        query += " AND (('#{Time.zone.now()}' BETWEEN events.start AND events.end) OR events.start > '#{Time.zone.now()}')"
        order = "events.start ASC"

      elsif params[:in_progress]
        query += " AND '#{Time.zone.now()}' BETWEEN events.start AND events.end"
        order = "events.start ASC"

      elsif params[:upcoming]
        query += " AND events.start > '#{Time.zone.now()}'"
        order = "events.start ASC"
      end

      if @@send_count
        count = Event
        .joins(event_employees: [{employee: [{contact: :email_addresses }]}])
        .where(query)
        .size
      end

      @events = Event
      .joins(event_employees: [{employee: [{contact: :email_addresses }]}])
      .where(query)
      .order(order)
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

    # By gc_i_cal_uid----------------------------------------------------------------
    elsif params[:gc_i_cal_uid]
      if @event
        render json: @event, include: '**'
      else
        render status: :not_found
      end

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

  # PATCH/PUT /events/1 or /events
  def update
    if @event.update(event_only_params)
      if event_employee_params
        event_employee_params.each do | worker_params |
          worker = @event
            .event_employees
            .where( employee_id: worker_params[:employee_id] )
            .first_or_create
          worker.update(worker_params.except(:employee_id))
        end
      end
      render json: @event, include: '**'
    else
      render status: :unprocessable_entity
    end
  end

  # DELETE /events/1
  def destroy
    @event.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event
      if params[:id]
        @event = Event.find(params[:id])
      elsif params[:gc_i_cal_uid]
        @event = Event.find_by gc_i_cal_uid: params[:gc_i_cal_uid]
      end
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
        :start,
        :end,
        :description,
        :driving_time,
        :end,
        :etag,
        :extendedProperties,
        :gc_id,
        :html_link,
        :gc_i_cal_uid,
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

    def event_only_params
      event_params.except(:event_employees_attributes)
    end

    def event_employee_params
      event_params.slice(:event_employees_attributes)[:event_employees_attributes]
    end
end
