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
      query = ''
      terms = params[:q].split
      terms.each do |term|
        query += "(first_name LIKE '%#{term}%'
        OR first_name LIKE '%#{term.capitalize}%'
        OR last_name LIKE '%#{term}%'
        OR last_name LIKE '%#{term.capitalize}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end

      if @@send_count
        count = Contact
          .distinct
          .where(query)
          .size
      end

      @contacts = Contact
        .distinct
        .where(query)

      render json: @contacts, root: "contacts", meta: { count: count }, include: "**"

    elsif params[:email]
      if !@contact
        emailAddress = EmailAddress.find_or_create_by(email_address: params[:email])
        @contact = emailAddress.create_contact
      end
      render json: @contact, include: '**'

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
      if params[:id]
        @contact = Contact.find(params[:id])
      elsif params[:email]
        @contact = Contact
          .joins(:email_address)
          .find_by("email_addresses.email_address = '#{params[:email]}'")
      end
    end

    # Only allow a trusted parameter "white list" through.
    def contact_params
      params.require(:contact).permit(
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
      )
    end
end
