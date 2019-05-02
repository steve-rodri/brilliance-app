class InventoriesController < ApplicationController
  before_action :set_inventory, only: [:show, :update, :destroy]

  # GET /inventories
  def index
    @inventories = Inventory.all.with_attached_photo

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
