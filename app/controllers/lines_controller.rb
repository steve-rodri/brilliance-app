class LinesController < ApplicationController
  before_action :set_line, only: [:show, :update, :destroy]
  @@lines_limit = 25
  # GET /lines
  def index
    if params[:q]
      query = "SELECT DISTINCT lines.*
      FROM lines
      LEFT OUTER JOIN invoices ON lines.invoice_id = invoices.id
      LEFT OUTER JOIN events ON invoices.event_id = events.id
      LEFT OUTER JOIN clients ON clients.id = events.client_id
      LEFT OUTER JOIN items ON lines.item_id = items.id
      LEFT OUTER JOIN item_contents ON item_contents.item_id = items.id
      LEFT OUTER JOIN contents ON contents.id = item_contents.content_id
      LEFT OUTER JOIN inventories ON inventories.id = contents.inventory_id
      WHERE "

      terms = params[:q].split
      terms.each do |term|
        a_term = term.gsub("'", %q(\\\''))
        query += "(items.name LIKE '%#{a_term}%'
        OR items.name LIKE '%#{a_term.capitalize}%'
        OR items.kind LIKE '%#{a_term}%'
        OR items.kind LIKE '%#{a_term.capitalize}%'
        OR items.install LIKE '%#{a_term}%'
        OR items.install LIKE '%#{a_term.capitalize}%'
        OR items.description LIKE '%#{a_term}%'
        OR items.description LIKE '%#{a_term.capitalize}%'
        OR contents.kind LIKE '%#{a_term}%'
        OR contents.kind LIKE '%#{a_term.capitalize}%'
        OR contents.description LIKE '%#{a_term}%'
        OR contents.description LIKE '%#{a_term.capitalize}%'
        OR inventories.category LIKE '%#{a_term}%'
        OR inventories.category LIKE '%#{a_term.capitalize}%'
        OR inventories.name LIKE '%#{a_term}%'
        OR inventories.name LIKE '%#{a_term.capitalize}%'
        OR inventories.manufacturer LIKE '%#{a_term}%'
        OR inventories.manufacturer LIKE '%#{a_term.capitalize}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end

      query += " AND lines.price > 0"

      if params[:client_id]
        query += " AND clients.id = '#{params[:client_id]}'"
      end

      query += " LIMIT #{@@lines_limit}"

      @lines = Line.find_by_sql(query)
    else
      @lines = Line.all
    end
    render json: @lines, root: 'lines', include: '**'
  end

  # GET /lines/1
  def show
    render json: @line, include: '**', serializer: NestedLineSerializer
  end

  # POST /lines
  def create
    @line = Line.new(line_params)

    if @line.save
      render json: @line, status: :created, location: @line, include: '**', serializer: NestedLineSerializer
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /lines/1
  def update
    if @line.update(line_params)
      render json: @line, include: '**', serializer: NestedLineSerializer
    else
      render json: @line.errors, status: :unprocessable_entity
    end
  end

  # DELETE /lines/1
  def destroy
    @line.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_line
      @line = Line.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def line_params
      params.require(:line).permit(:inc, :inc_in_commission, :quantity, :discount_adj, :price, :invoice_id, :item_id)
    end
end
