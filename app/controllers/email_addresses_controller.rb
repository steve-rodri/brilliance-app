class EmailAddressesController < ApplicationController
  before_action :set_email_address, only: [:show, :update, :destroy]

  # GET /email_addresses
  def index
    @@send_count = false
    if params[:send_count]
      @@send_count = true
    end

    if params[:q]
      count = 0
      terms = params[:q].split
      query = ""
      terms.each do |term|
        query += "
        (email_address LIKE '%#{term}%'
        OR email_address LIKE '%#{term.capitalize}%'
        OR email_address LIKE '%#{term.upcase}%'
        OR email_address LIKE '%#{term.downcase}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end
      if @@send_count
        count = EmailAddress
          .distinct
          .where(query)
          .size
      end
      @email_addresses = EmailAddress
        .distinct
        .where(query)

      render json: @email_addresses, root: 'email_addresses', meta: { count: count }
    else
      @email_addresses = EmailAddress.all
      render json: @email_addresses
    end
  end

  # GET /email_addresses/1
  def show
    render json: @email_address
  end

  # POST /email_addresses
  def create
    @email_address = EmailAddress.new(email_address_params)

    if @email_address.save
      render json: @email_address, status: :created, location: @email_address
    else
      render json: @email_address.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /email_addresses/1
  def update
    if @email_address.update(email_address_params)
      render json: @email_address
    else
      render json: @email_address.errors, status: :unprocessable_entity
    end
  end

  # DELETE /email_addresses/1
  def destroy
    @email_address.destroy
  end

  def find
    @email_address = EmailAddress.where("email_address = '#{params[:q]}'")
    render json: @email_address
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_email_address
      @email_address = EmailAddress.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def email_address_params
      params.require(:email_address).permit(:email_address)
    end
end
