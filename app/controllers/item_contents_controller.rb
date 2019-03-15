class ItemContentsController < ApplicationController
  before_action :set_item_content, only: [:show, :update, :destroy]

  # GET /item_contents
  def index
    @item_contents = ItemContent.all

    render json: @item_contents
  end

  # GET /item_contents/1
  def show
    render json: @item_content
  end

  # POST /item_contents
  def create
    @item_content = ItemContent.new(item_content_params)

    if @item_content.save
      render json: @item_content, status: :created, location: @item_content
    else
      render json: @item_content.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /item_contents/1
  def update
    if @item_content.update(item_content_params)
      render json: @item_content
    else
      render json: @item_content.errors, status: :unprocessable_entity
    end
  end

  # DELETE /item_contents/1
  def destroy
    @item_content.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item_content
      @item_content = ItemContent.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def item_content_params
      params.require(:item_content).permit(:item_id, :content_id)
    end
end
