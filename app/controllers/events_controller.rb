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
      render json: @event, status: :created, location: @event
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/1
  def update
    if @event.update(event_params)
      render json: @event
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/
  def sync
    @event = Event.where(:i_cal_UID => params[:i_cal_UID]).first_or_create(event_params)

    if @event
      @event.update(event_params)
    end

    render json: {msg: 'synced'}
  end

  # DELETE /events/1
  def destroy
    @event.destroy
  end

  def find
    terms = params[:q].split

    terms.each do |term|
      @events = Event
      .select(
        'events.*,
        contacts.first_name AS client_first_name,
        contacts.last_name AS client_last_name,
        companies.name AS company_name,
        places.name AS location,
        places.short_name AS location_short_name'
      )
      .joins('LEFT JOIN clients on clients.id = events.client_id')
      .joins('LEFT JOIN contacts on contacts.id = clients.contact_id')
      .joins('LEFT JOIN companies on companies.id = clients.company_id')
      .joins('LEFT JOIN places on places.id = events.location_id')
      .where(
        "contacts.first_name LIKE '%#{term.capitalize}%'
         OR contacts.last_name LIKE '%#{term.capitalize}%'
         OR companies.name LIKE '%#{term.capitalize}%'
         OR action LIKE '%#{term.capitalize}%'
         OR kind LIKE '%#{term.capitalize}%'
         OR description LIKE '%#{term.capitalize}%'
         OR tags LIKE '%#{term.capitalize}%'
         OR summary LIKE '%#{term.capitalize}%'
         OR places.name LIKE '%#{term.capitalize}%'
         OR places.short_name LIKE '%#{term}%'
         OR places.short_name LIKE '%#{term.upcase}%'"
      )
      .order(start: :desc)
      .paginate(page: params[:page], per_page: @@items_per_page)
    end

    render json: @events, include: '**'
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
        :creator,
        :description,
        :driving_time,
        :employee_id,
        :employees,
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
