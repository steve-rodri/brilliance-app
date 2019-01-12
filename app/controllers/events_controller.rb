class EventsController < ApplicationController
  before_action :set_event, only: [:show, :update, :destroy]

  # GET /events
  def index
    @events = Event.all.limit(50)

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
  def bulk_update
    render json: {msg: "batch update"}
    # updateEvents = @event.import[event_params], on_duplicate_key_update: {
    #   conflict_target: [:gc_id],
    #   columns: [
    #     :action,
    #     :break,
    #     :break_start,
    #     :call_time,
    #     :clock_out,
    #     :confirmation,
    #     :creator,
    #     :description,
    #     :driving_time,
    #     :end,
    #     :gc_id,
    #     :html_link,
    #     :id,
    #     :kind,
    #     :notes,
    #     :start,
    #     :summary,
    #     :tags
    #   ]
    # }
    # if updateEvents.results
    #   render json: {@event.failed_instances}
    # end
    # else
    #   render json: @event.errors, status: :unprocessable_entity
    #end


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
        :attendees,
        :break,
        :break_start,
        :call_time,
        :client_id,
        :clock_out,
        :confirmation,
        :created,
        :creator,
        :description,
        :driving_time,
        :end,
        :etag,
        :extendedProperties,
        :gc_id,
        :html_link,
        :id,
        :kind,
        :location,
        :notes,
        :organizer,
        :reminders,
        :sequence,
        :start,
        :status,
        :summary,
        :tags,
        :updated
      )
    end
end
