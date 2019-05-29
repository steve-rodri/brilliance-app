class ContactsController < ApplicationController
  before_action :set_contact, only: [:show, :update, :destroy]

  # GET /contacts
  def index
    @@send_count = false
    if params[:send_count]
      @@send_count = true
    end

    if params[:q]
      count = 0
      query = 'clients.id IS NULL AND '
      terms = params[:q].split
      terms.each do |term|
        query += "(contacts.first_name LIKE '%#{term}%'
        OR contacts.first_name LIKE '%#{term.capitalize}%'
        OR contacts.last_name LIKE '%#{term}%'
        OR contacts.last_name LIKE '%#{term.capitalize}%')"

        if terms.index(term) + 1 < terms.length
          query += " OR "
        end
      end

      if @@send_count
        count = Contact
          .distinct
          .left_outer_joins(:client)
          .where(query)
          .size
      end

      @contacts = Contact
        .distinct
        .left_outer_joins(:client)
        .where(query)

      render json: @contacts, root: "contacts", meta: { count: count }, include: "**"

    elsif params[:email]

      @contact = Contact
        .left_outer_joins(:email_address)
        .where("email_addresses.email_address = '#{params[:email]}'")
        .first_or_create

      render json: @contact
    else
      @contacts = Contact.all
      render json: @contacts, include: '**'
    end
  end

  # GET /contacts/1
  def show
    render json: @contact, include: '**'
  end

  # POST /contacts
  def create
    @contact = Contact.new(contact_params)

    if @contact.save
      render json: @contact, status: :created, location: @contact, include: '**'
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contacts/1
  def update
    if @contact.update(contact_params)
      render json: @contact, include: '**'
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # DELETE /contacts/1
  def destroy
    @contact.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contact
      @contact = Contact.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def contact_params
      params.require(:contact).permit(:photo, :prefix, :first_name, :last_name, :phone_number, :work_email, :ss)
    end
end
