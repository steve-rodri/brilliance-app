class ContactsController < ApplicationController
  before_action :set_contact, only: [:show, :update, :destroy]

  # GET /contacts
  def index
    @contacts = Contact.all

    render json: @contacts, include: '**'
  end

  # GET /contacts/1
  def show
    render json: @contact, include: '**'
  end

  # POST /contacts
  def create
    @contact = Contact.new(contact_params)

    if @contact.save
      render json: @contact, status: :created, location: @contact
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contacts/1
  def update
    if @contact.update(contact_params)
      render json: @contact
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # DELETE /contacts/1
  def destroy
    @contact.destroy
  end

  def find
    if params[:q]
      terms = params[:q].split

      if terms.length > 1

        contact_query = "
        clients.id IS NULL
        AND first_name
        LIKE '%#{terms[0].capitalize}%'
        AND last_name
        LIKE '%#{terms[1].capitalize}%'"
      else
        contact_query = "
        clients.id IS NULL
        AND first_name
        LIKE '%#{terms[0].capitalize}%'"
      end

      #contacts found based on query
      @contacts = Contact.left_outer_joins(:client).where(contact_query)

      render json: @contacts
    end

    if params[:email]
      @contact = Contact.left_outer_joins(:email_address).where("email_addresses.email_address = '#{params[:email]}'").first_or_create
      render json: @contact
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contact
      @contact = Contact.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def contact_params
      params.require(:contact).permit(:Photo, :Prefix, :First_Name, :Last_Name, :Phone_Number, :Work_Email, :SS, :q)
    end
end
