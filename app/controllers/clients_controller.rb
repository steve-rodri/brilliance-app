class ClientsController < ApplicationController
  before_action :set_client, only: [:show, :update, :destroy]

  @@clients_select_query = "clients.*,
  contacts.photo,
  contacts.prefix,
  contacts.first_name,
  contacts.last_name,
  contacts.phone_number,
  contacts.work_email,
  contacts.ss,
  companies.name AS company_name,
  companies.phone_number,
  companies.logo,
  companies.website,
  (
    CASE
      WHEN contacts.first_name IS NOT NULL
        THEN
          CASE
            WHEN contacts.last_name IS NOT NULL
              THEN
              CONCAT(contacts.first_name, ' ', contacts.last_name)

              ELSE
              contacts.first_name
          END

      ELSE
        CASE
          WHEN contacts.last_name IS NOT NULL
            THEN
            contacts.last_name
        END
    END

  ) AS full_name,
  (
    CASE
      WHEN
      (
        CASE
          WHEN contacts.first_name IS NOT NULL
            THEN
              CASE
                WHEN contacts.last_name IS NOT NULL
                  THEN
              CONCAT(contacts.first_name, ' ', contacts.last_name)

                  ELSE
                  contacts.first_name
              END

          ELSE
            CASE
              WHEN contacts.last_name IS NOT NULL
                THEN
                contacts.last_name
            END
        END

      ) IS NOT NULL THEN

          CASE
            WHEN companies.name IS NOT NULL
              THEN
              CONCAT(
                (
                  CASE
                    WHEN contacts.first_name IS NOT NULL
                      THEN
                        CASE
                          WHEN contacts.last_name IS NOT NULL
                            THEN
                        CONCAT(contacts.first_name, ' ', contacts.last_name)

                            ELSE
                            contacts.first_name
                        END

                    ELSE
                      CASE
                        WHEN contacts.last_name IS NOT NULL
                          THEN
                          contacts.last_name
                      END
                  END

                ),
                ' - ',
                companies.name
              )

              ELSE
              (
                CASE
                  WHEN contacts.first_name IS NOT NULL
                    THEN
                      CASE
                        WHEN contacts.last_name IS NOT NULL
                          THEN
                      CONCAT(contacts.first_name, ' ', contacts.last_name)

                          ELSE
                          contacts.first_name
                      END

                  ELSE
                    CASE
                      WHEN contacts.last_name IS NOT NULL
                        THEN
                        contacts.last_name
                    END
                END
              )
          END

      ELSE
        CASE
          WHEN companies.name IS NOT NULL
            THEN
            companies.name

        END
    END

  ) AS sorting_name"

  # GET /clients
  def index
    items_per_page = 25
    if params[:category]
      if params[:category] == 'All'
        @clients = Client
          .select(@@clients_select_query)
          .left_outer_joins(:contact, :company)
          .order('sorting_name')
          .paginate(page: params[:page], per_page: items_per_page)

        render json: @clients, include: '**'

      elsif params[:category] == 'Production'
        production_queries = []
        on_premise_locations = Place.where("installation = true")

        on_premise_locations.each do |location|
          id = location.as_json["id"]
          if id
            production_queries.push("location_id != #{id}")
          end
        end

        query = production_queries.join(' AND ')
        production_events = Event.where(query)

        client_queries = []

        production_events.each do |event|
          id = event.as_json["client_id"]
          if id
            client_queries.push("clients.id = #{id}")
          end
        end

        query = client_queries.join(' OR ')

        @clients = Client
          .select(@@clients_select_query)
          .left_outer_joins(:contact, :company)
          .order('sorting_name')
          .where(query)
          .paginate(page: params[:page], per_page: items_per_page)

        render json: @clients, include: '**'
      else

        location = Place.find_by short_name: params[:category]
        if location

          location_id = location.as_json["id"]

          events = Event.where("location_id = #{location_id}")
          puts events
          if events.length > 0

            client_queries = []

            events.each do |event|
              id = event.as_json["client_id"]
              if id
                client_queries.push("clients.id = #{id}")
              end
            end

            query = client_queries.join(' OR ')

            @clients = Client
              .select(@@clients_select_query)
              .left_outer_joins(:contact, :company)
              .order('sorting_name')
              .where(query)
              .paginate(page: params[:page], per_page: items_per_page)

            render json: @clients, include: '**'
          else
            render status: 404
          end

        else
          render status: 404
        end
      end
    else
      @clients = Client
        .select(@@clients_select_query)
        .left_outer_joins(:contact, :company)
        .order('sorting_name')
        .paginate(page: params[:page], per_page: items_per_page)

      render json: @clients, include: '**'
    end
  end

  # GET /clients/1
  def show
    render json: @client, include: '**'
  end

  #GET /clients/1/events
  def events
    items_per_page = 25
    @events = Event
      .where("client_id = #{params[:id]}")
      .paginate(page: params[:page], per_page: items_per_page)

    render json: @events, include: '**'
  end

  # POST /clients
  def create
    @client = Client.new(client_params)

    if @client.save
      render json: @client, status: :created, location: @client
    else
      render json: @client.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /clients/1
  def update
    if @client.update(client_params)
      render json: @client
    else
      render json: @client.errors, status: :unprocessable_entity
    end
  end

  # DELETE /clients/1
  def destroy
    @client.destroy
  end

  # GET /clients/find
  def find
    terms = params[:q].split

    terms.each do |term|
      @clients = Client
      .select(@@clients_select_query)
      .left_outer_joins(:contact, :company)
      .order('sorting_name')
      .where(
        "contacts.first_name LIKE '%#{term.capitalize}%'
         OR contacts.last_name LIKE '%#{term.capitalize}%'
         OR companies.name LIKE '%#{term.capitalize}%'"
      )
      .limit(10)
    end

    render json: @clients, include: '**'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client
      @client = Client.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def client_params
      params.require(:client).permit(:contact_id, :q, :category)
    end
end
