class AddressesController < ApplicationController
  before_action :set_address, only: [:show, :update, :destroy]

  # GET /addresses
  def index
    if params[:q]
      query = ""
      terms = params[:q].split
      terms.each do |term|
        query += "(address LIKE '%#{term}%'
        OR address LIKE '%#{term.capitalize}%'
        OR address LIKE '%#{term.upcase}%'
        OR address LIKE '%#{term.downcase}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end
      @addresses = Address
        .distinct
        .where(query)
        .order(:address)
      render json: @addresses
    else
      @addresses = Address.all
      render json: @addresses
    end
  end

  # GET /addresses/1
  def show
    render json: @address
  end

  # POST /addresses
  def create
    @address = Address.new(address_params)

    if @address.save
      render json: @address, status: :created, location: @address
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /addresses/1
  def update
    if @address.update(address_params)
      render json: @address
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  # DELETE /addresses/1
  def destroy
    @address.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_address
      @address = Address.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def address_params
      params.require(:address).permit(:address)
    end
end
