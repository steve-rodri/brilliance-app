class ClientsController < ApplicationController
  before_action :set_client, only: [:show, :update, :destroy]

  # GET /clients
  def index
    items_per_page = 25

    @clients = Client
    .all
    .paginate(page: params[:page], per_page: items_per_page)

    render json: @clients, include: '**'
  end

  # GET /clients/1
  def show
    render json: @client, include: '**'
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

    if terms.length > 1
      contact_query = "SELECT * FROM contacts WHERE first_name LIKE '%#{terms[0].capitalize}%' AND last_name LIKE '%#{terms[1].capitalize}%' LIMIT 10"
    else
      contact_query = "SELECT * FROM contacts WHERE first_name LIKE '%#{terms[0].capitalize}%' LIMIT 10"
    end

    company_query = "SELECT * FROM companies WHERE name LIKE '%#{params[:q].capitalize}%'"

    contacts = execute_sql(contact_query)
    companies = execute_sql(company_query)

    clients = []
    if contacts
      contacts.each do |contact|
        id =  contact.as_json["id"]

        client = Client.find_by contact_id: "#{id}"
        if client
          clients.push(client)
        end
      end
    end

    if companies
      companies.each do |company|
        id = company.as_json["id"]

        client = Client.find_by company_id: "#{id}"
        if client
          clients.push(client)
        end
      end
    end

    render json: clients
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client
      @client = Client.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def client_params
      params.require(:client).permit(:contact_id, :q)
    end
end
