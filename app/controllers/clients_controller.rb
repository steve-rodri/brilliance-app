class ClientsController < ApplicationController
  before_action :set_client, only: [:show, :update, :destroy]
  @@items_per_page = 25
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
    @@date_where = nil
    if params[:start] && params[:end]
      @@start = Time.zone.parse(params[:start])
      @@end = Time.zone.parse(params[:end])
      @@date_where = "events.start BETWEEN '#{@@start}' AND '#{@@end}'"
    end
    @@send_count = false
    if params[:send_count]
      @@send_count = true
    end
    @@limit = nil
    if params[:limit]
      @@limit = params[:limit]
    end

    if params[:category]
      count = 0
      if params[:category] == 'Production'
        if @@send_count
          count = Client
            .select(@@clients_select_query).distinct
            .left_outer_joins(:contact, :company, event: :invoice)
            .joins("JOIN places ON places.id = events.location_id")
            .where("invoices.kind = Production Invoice OR places.installation = false")
            .size
        end
        @clients = Client
          .select(@@clients_select_query).distinct
          .left_outer_joins(:contact, :company, event: :invoice)
          .joins("JOIN places ON places.id = events.location_id")
          .where("invoices.kind = Production Invoice OR places.installation = false")
          .order('sorting_name')
          .paginate(page: params[:page], per_page: @@items_per_page)
      else
        short_name = params[:category]
        if @@send_count
          count = Client
            .select(@@clients_select_query).distinct
            .left_outer_joins(:contact, :company, :event)
            .joins("JOINS places ON places.id = events.location_id")
            .size
        end
        @clients = Client
          .select(@@clients_select_query).distinct
          .left_outer_joins(:contact, :company, :event)
          .joins("JOINS places ON places.id = events.location_id")
          .order('sorting_name')
          .where("places.short_name = #{short_name}")
          .paginate(page: params[:page], per_page: @@items_per_page)

        if count
          render json: @clients, meta:{ count: count }, include: '**'
        else
          render json: @clients, include: '**'
        end

      end

    elsif params[:q]
      query = "SELECT DISTINCT clients.*
      FROM clients
      LEFT OUTER JOIN companies ON companies.id = clients.company_id
      LEFT OUTER JOIN contacts ON contacts.id = clients.contact_id
      LEFT OUTER JOIN email_addresses ON email_addresses.contact_id = contacts.id
      WHERE "

      terms = params[:q].split
      terms.each do |term|
        query += "(contacts.first_name LIKE '%#{term.capitalize}%'
        OR contacts.first_name LIKE '%#{term}%'
        OR contacts.last_name LIKE '%#{term.capitalize}%'
        OR contacts.last_name LIKE '%#{term}%'
        OR companies.name LIKE '%#{term.capitalize}%'
        OR companies.name LIKE '%#{term}%'
        OR email_addresses.email_address LIKE '%#{term.downcase}%'
        OR email_addresses.email_address LIKE '%#{term}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end

      query += " #{@@date_where}"

      if @@send_count
        count = Client.find_by_sql(query).size
      end

      if @@limit
        query += " LIMIT #{@@limit}"
      end

      if params[:page]
        page_num = params[:page].to_i
        offset = ( page_num - 1 ) * @@items_per_page
        query += " OFFSET #{offset} ROWS"
        query += " FETCH NEXT #{@@items_per_page} ROWS ONLY"
      end

      @clients = Client.find_by_sql(query)

      if count
        render json: @clients, root:"clients", meta: { count: count }, include: '**'
      else
        render json: @clients, root: "clients", include: '**'
      end

    else
      count = 0

      if @@send_count
        count = Client
          .select(@@clients_select_query).distinct
          .left_outer_joins(:contact, :company)
          .size
      end
      @clients = Client
        .select(@@clients_select_query).distinct
        .left_outer_joins(:contact, :company)
        .order('sorting_name')
        .paginate(page: params[:page], per_page: @@items_per_page)

      if count
        render json: @invoices, meta: { count: count }, include: '**'
      else
        render json: @invoices, include: '**'
      end

    end
  end

  # GET /clients/1
  def show
    render json: @client, include: '**'
  end

  # POST /clients
  def create
    @client = Client.find_or_initialize_by(client_params)


    if @client.save
      render json: @client, status: :created, location: @client, include: '**'
    else
      render json: @client.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /clients/1
  def update
    if @client.update(client_params)
      render json: @client, include: '**'
    else
      render json: @client.errors, status: :unprocessable_entity
    end
  end

  # DELETE /clients/1
  def destroy
    @client.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client
      @client = Client.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def client_params
      params.require(:client).permit(
        :contact_id,
        :company_id,
        contact_attributes: [
          :photo,
          :prefix,
          :first_name,
          :last_name,
          :phone_number,
          :email,
          :ss,
          email_addresses_attributes: [
            :email_address,
            :notifications
          ]
        ],
        company_attributes: [
          :name,
          :logo,
          :website,
          :phone_number,
          email_addresses_attributes: [
            :email_address,
            :notifications
          ]
        ]
      )
    end
end
