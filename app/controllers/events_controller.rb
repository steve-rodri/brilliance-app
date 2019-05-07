class EventsController < ApplicationController
  before_action :set_event, only: [:show, :update, :destroy]
  @@items_per_page = 25
  @@date_start = Time.zone.today()
  @@date_end = Time.zone.today()
  @@date_where = ''

  # GET /events
  def index
    @@date_where = ''
    if params[:date_start] && params[:date_end]
      @@date_start = Time.zone.parse(params[:date_start])
      @@date_end = Time.zone.parse(params[:date_end])
      @@date_where = "events.start BETWEEN '#{@@date_start}' AND '#{@@date_end}'"
    end

    if (
        params[:category]  ||
        params[:q]         ||
        params[:client_id] ||
        params[:email]     ||
        params[:iCalUID]
      )

      if params[:category]

        if params[:category] == 'Production'
          count = Event
            .joins("JOIN places ON places.id = events.location_id")
            .where(@@date_where)
            .where("places.installation = false")
            .size
          @events = Event
            .joins("JOIN places ON places.id = events.location_id")
            .where(@@date_where)
            .where("places.installation = false")
            .order(:start)
            .paginate(page: params[:page], per_page: @@items_per_page)
          render json: @events, meta: { count: count }, include: '**'
        else
          short_name = params[:category]
          count = Event
            .joins("JOIN places on places.id = events.location_id")
            .where(@@date_where)
            .where("places.short_name = '#{short_name}'")
            .size
          @events = Event
            .joins("JOIN places on places.id = events.location_id")
            .where(@@date_where)
            .where("places.short_name = '#{short_name}'")
            .order(:start)
            .paginate(page: params[:page], per_page: @@items_per_page)
          render json: @events, meta: { count: count }, include: '**'
        end

      end

      if params[:q]
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

        if params[:date_start] && params[:date_end]
          query += " AND events.start BETWEEN '#{@@date_start}' AND '#{@@date_end}'"
        end
        query += " ORDER BY events.start"
        query += " OFFSET #{offset} ROWS"
        query += " FETCH NEXT #{@@items_per_page} ROWS ONLY"

        @events = Event.find_by_sql(query)

        render json: @events, meta: { count: @events.size }, include: '**'
      end

      if params[:email]

        email = params[:email]

        count = Event
        .joins(event_employees: [{employee: [{contact: :email_address }]}])
        .where("email_addresses.email_address LIKE '%#{email}%'")
        .size

        @events = Event
        .joins(event_employees: [{employee: [{contact: :email_address }]}])
        .where("email_addresses.email_address LIKE '%#{email}%'")
        .order(start: :desc)
        .paginate(page: params[:page], per_page: @@items_per_page)

        render json: @events, meta: {count: count }, include: '**'
      end

      if params[:iCalUID]
        id = params[:iCalUID]
        @event = Event.where( i_cal_UID: "#{id}").first
        render json: @events, include: '**'
      end

      if params[:client_id]
        id = params[:client_id]
        @events = Event
          .where( client_id: "#{id}" )
          .where(@@date_where)
          .order(:start)
          .paginate(page: params[:page], per_page: @@items_per_page)

        render json: @events, meta: {count: @events.size }, include: '**'
      end
    else
      @events = Event
        .where(@@date_where)
        .order(:start)
        .paginate(page: params[:page], per_page: @@items_per_page)

      render json: @events, meta: {count: @events.size }, include: '**'
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
    event_employees_params = event_params.slice(:event_employees_attributes)
    employee_params = [ event_employees_params[:event_employees_attributes] ]

    @event = Event.where(:i_cal_UID => params[:i_cal_UID]).first_or_create(event_params)
    if @event
      @event.update(event_only_params)
      if @event.event_employees
        employee_params.each do |p|
          if p
            if p[0]
              worker = @event
                .event_employees
                .where( employee_id: p[0][:employee_id] )
                .first_or_create
              if worker
                worker.update(p[0])
              end
            end
          end
        end
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



# SELECT events.*
# FROM events
# LEFT OUTER JOIN clients ON clients.id = events.client_id
# LEFT OUTER JOIN companies ON companies.id = clients.company_id
# LEFT OUTER JOIN event_employees ON event_employees.event_id = events.id
# LEFT OUTER JOIN employees ON employees.id = event_employees.employee_id
# LEFT OUTER JOIN contacts clients_contacts ON clients_contacts.id = clients.contact_id
# LEFT OUTER JOIN contacts employees_contacts ON  employees_contacts.id = employees.contact_id
# LEFT OUTER JOIN email_addresses clients_email_addresses ON clients_email_addresses.contact_id = clients_contacts.id
# LEFT OUTER JOIN email_addresses employees_email_addresses ON employees_email_addresses.contact_id = employees_contacts.id
# LEFT OUTER JOIN places places_location ON places_location.id = events.location_id
# LEFT OUTER JOIN places places_call_location ON places_call_location.id = events.call_location_id
# WHERE (clients_contacts.first_name LIKE '%Steve%'
#  OR clients_contacts.last_name LIKE '%Steve%'
#  OR employees_contacts.first_name LIKE '%Steve%'
#  OR employees_contacts.last_name LIKE '%Steve%'
#  OR companies.name LIKE '%Steve%'
#  OR events.action LIKE '%Steve%'
#  OR events.kind LIKE '%Steve%'
#  OR events.description LIKE '%Steve%'
#  OR events.tags LIKE '%Steve%'
#  OR events.summary LIKE '%Steve%'
#  OR events.summary LIKE '%Steve%'
#  OR places_location.name LIKE '%Steve%'
#  OR places_location.short_name LIKE '%Steve%'
#  OR places_location.short_name LIKE '%STEVE%'
#  OR places_call_location.name LIKE '%Steve%'
#  OR places_call_location.short_name LIKE '%Steve%'
#  OR places_call_location.short_name LIKE '%STEVE%'
#  OR clients_email_addresses.email_address LIKE '%steve%'
#  OR clients_email_addresses.email_address LIKE '%Steve%'
#  OR employees_email_addresses.email_address LIKE '%steve%'
#  OR employees_email_addresses.email_address LIKE '%Steve%') AND (clients_contacts.first_name LIKE '%Weinberg%'
#  OR clients_contacts.last_name LIKE '%Weinberg%'
#  OR employees_contacts.first_name LIKE '%Weinberg%'
#  OR employees_contacts.last_name LIKE '%Weinberg%'
#  OR companies.name LIKE '%Weinberg%'
#  OR events.action LIKE '%Weinberg%'
#  OR events.kind LIKE '%Weinberg%'
#  OR events.description LIKE '%Weinberg%'
#  OR events.tags LIKE '%Weinberg%'
#  OR events.summary LIKE '%Weinberg%'
#  OR events.summary LIKE '%Weinberg%'
#  OR places_location.name LIKE '%Weinberg%'
#  OR places_location.short_name LIKE '%Weinberg%'
#  OR places_location.short_name LIKE '%WEINBERG%'
#  OR places_call_location.name LIKE '%Weinberg%'
#  OR places_call_location.short_name LIKE '%Weinberg%'
#  OR places_call_location.short_name LIKE '%WEINBERG%'
#  OR clients_email_addresses.email_address LIKE '%weinberg%'
#  OR clients_email_addresses.email_address LIKE '%Weinberg%'
#  OR employees_email_addresses.email_address LIKE '%weinberg%'
#  OR employees_email_addresses.email_address LIKE '%Weinberg%')
#  ORDER BY events.start DESC
#  OFFSET 0 ROWS
#  FETCH NEXT 25 ROWS ONLY
