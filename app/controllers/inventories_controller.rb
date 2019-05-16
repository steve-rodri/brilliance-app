class InventoriesController < ApplicationController
  before_action :set_inventory, only: [:show, :update, :destroy]

  # GET /inventories
  def index
    if params[:q]
      query = ""

      terms = params[:q].split
      terms.each do |term|
        query += "(inventories.category LIKE '%#{term}%'
        OR inventories.category LIKE '%#{term.capitalize}%'
        OR inventories.name LIKE '%#{term}%'
        OR inventories.name LIKE '%#{term.capitalize}%'
        OR inventories.manufacturer LIKE '%#{term}'
        OR inventories.manufacturer LIKE '%#{term.capitalize}')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end

      @inventories = Inventory
        .distinct
        .where(query)
        .with_attached_photo
        .limit(5)
    else
      @inventories = Inventory.all.with_attached_photo
    end
    render json: @inventories, include: '**'
  end

  # GET /inventories/1
  def show
    render json: @inventory, include: '**'
  end

  # POST /inventories
  def create
    @inventory = Inventory.new(inventory_params)

    if @inventory.save
      render json: @inventory, include: '**', status: :created, location: @inventory
    else
      render json: @inventory.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /inventories/1
  def update
    if @inventory.update(inventory_params)
      render json: @inventory, include: '**'
    else
      render json: @inventory.errors, status: :unprocessable_entity
    end
  end

  # DELETE /inventories/1
  def destroy
    @inventory.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_inventory
      @inventory = Inventory.find(params[:id])
      if @inventory.photo.attached?
        return @inventory.with_attached_photo
      else
        return @inventory
      end
    end

    # Only allow a trusted parameter "white list" through.
    def inventory_params
      params.require(:inventory).permit(:category, :name, :manufacturer, :photo, :total_owned, :sell_price, :rental_price, :net_cost_per_invoice, :purchase_price)
    end
end
