
class EventsController < ApplicationController
  before_action :set_event, only: [:show, :update, :destroy]

  @@items_per_page = 25

  # GET /events
  def index
    if params[:category]
      if params[:category] == 'All'

        @events = Event
          .all
          .order(start: :desc)
          .paginate(page: params[:page], per_page: @@items_per_page)

      elsif params[:category] == 'Production'
        production_querys = []

        on_premise_locations = Place.where("installation = true")

        on_premise_locations.each do |location|
          id = location.as_json["id"]
          production_querys.push("location_id != #{id}")
        end

        query = production_querys.join(' AND ')

        @events = Event
          .where(query)
          .order(start: :desc)
          .paginate(page: params[:page], per_page: @@items_per_page)

      else

        location = Place.find_by short_name: params[:category]
        location_id = location.as_json["id"]

        @events = Event
          .where("location_id = #{location_id}")
          .order(start: :desc)
          .paginate(page: params[:page], per_page: @@items_per_page)

      end
    else

      @events = Event
        .all
        .order(start: :desc)
        .paginate(page: params[:page], per_page: @@items_per_page)

    end

    render json: @events, include: '**'
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

  # PATCH/PUT /events/
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
              worker = @event.event_employees.where( employee_id: p[0][:employee_id] ).first_or_create
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

  def find

    if params[:q]

      terms = params[:q].split

      terms.each do |term|
        @events = Event
        .left_outer_joins(
          client: [ :contact, :company ],
          event_employees: [{employee: [{contact: :email_address }]}]
        )
        .joins('LEFT OUTER JOIN places places_location ON places_location.id = events.location_id')
        .joins('LEFT OUTER JOIN places places_call_location ON places_call_location.id = events.call_location_id')
        .where(
          "contacts.first_name LIKE '%#{term.capitalize}%'
           OR contacts.last_name LIKE '%#{term.capitalize}%'
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
           OR email_addresses.email_address LIKE '%#{term}%'"
        )
        .order(start: :desc)
        .paginate(page: params[:page], per_page: @@items_per_page)
      end

      render json: @events, include: '**'
    end

    if params[:email]

      email = params[:email]

      @events = Event
      .joins(event_employees: [{employee: [{contact: :email_address }]}])
      .where("email_addresses.email_address LIKE '%#{email}%'")
      .order(start: :desc)
      .paginate(page: params[:page], per_page: @@items_per_page)

      render json: @events, include: '**'
    end

    if params[:iCalUID]
      id = params[:iCalUID]
      @event = Event.where( i_cal_UID: "#{id}").first
      render json: @event, include: '**'
    end
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
