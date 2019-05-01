class ItemsController < ApplicationController
  before_action :set_item, only: [:show, :update, :destroy]

  @@items_limit = 25

  # GET /items
  def index
    if params[:q]

      query = "SELECT DISTINCT items.*
      FROM items
      LEFT OUTER JOIN item_contents ON item_contents.item_id = items.id
      LEFT OUTER JOIN contents ON contents.id = item_contents.content_id
      LEFT OUTER JOIN inventories ON inventories.id = contents.inventory_id
      WHERE "

      terms = params[:q].split
      terms.each do |term|

        query += "(items.name LIKE '%#{term}%'
        OR items.kind LIKE '%#{term}%'
        OR items.install LIKE '%#{term}%'
        OR items.description LIKE '%#{term}%'
        OR contents.kind LIKE '%#{term}%'
        OR contents.description LIKE '%#{term}%'
        OR inventories.category LIKE '%#{term}%'
        OR inventories.name LIKE '%#{term}%'
        OR inventories.manufacturer LIKE '%#{term}')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
        
      end

      query += " LIMIT #{@@items_limit}"

      @items = Item.find_by_sql(query)
    else
      @items = Item.all
    end
    render json: @items, include: '**'
  end

  # GET /items/1
  def show
    render json: @item
  end

  # POST /items
  def create
    @item = Item.new(item_params)

    if @item.save
      render json: @item, status: :created, location: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items/1
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /items/1
  def destroy
    @item.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def item_params
      params.require(:item)
      .permit(
        :name,
        :kind,
        :install,
        :description,
        :additional_notes,
        :quantity,
        :discount_adj,
        lines_attributes: [
          :id,
          :inc,
          :inc_in_commission,
          :discount_adj,
          :quantity,
          :price
        ],
        item_contents_attributes: [
          :id,
          :item_id,
          :content_id
        ],
        contents_attributes: [
          :id,
          :kind,
          :description,
          :description_only,
          :quantity,
          :inc,
          :inc_discount_in_opct,
          :discount_adj,
          :hours_for_labor_only,
          :subcontracted,
          :inventory_id
        ]
      )
    end
end
