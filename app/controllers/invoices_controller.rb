class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :update, :destroy]

  # GET /invoices
  def index
    items_per_page = 25

    if params[:category]
      if params[:category] == 'All'

        @invoices = Invoice
          .all
          .paginate(page: params[:page], per_page: items_per_page)

        render json: @invoices, include: '**'

      elsif params[:category] == 'Production'
        production_queries = []
        on_premise_locations = Place.where("installation = true")

        on_premise_locations.each do |location|
          id = location.as_json["id"]
          if id
            production_queries.push("location_id != #{id}")
          end
        end

        query = production_queries.join(' AND ')
        production_events = Event.where(query)

        invoice_queries = []

        production_events.each do |event|
          id = event.as_json["id"]
          if id
            invoice_queries.push("event_id = #{id}")
          end
        end

        query = invoice_queries.join(' OR ')

        @invoices = Invoice
          .where("kind = 'Production'")
          .where(query)
          .paginate(page: params[:page], per_page: items_per_page)

        render json: @invoices, include: '**'

      else

        location = Place.find_by short_name: params[:category]
        if location

          id = location.as_json["id"]
          if id
            events = Event.where("location_id = #{id}")
            if events.length > 0

              invoice_queries = []

              events.each do |event|
                id = event.as_json["id"]
                if id
                  invoice_queries.push("event_id = #{id}")
                end
              end

              query = invoice_queries.join(' OR ')

              @invoices = Invoice
                .where(query)
                .paginate(page: params[:page], per_page: items_per_page)

              render json: @invoices, include: '**'
            else
              render status: 404
            end
          end

        else
          render status: 404
        end
      end
    else
      @invoices = Invoice
        .all
        .paginate(page: params[:page], per_page: items_per_page)

      render json: @invoices, include: '**'
    end
  end

  # GET /invoices/1
  def show
    render json: @invoice, include: '**'
  end

  # POST /invoices
  def create
    @invoice = Invoice.new(invoice_params)

    if @invoice.save
      render json: @invoice, status: :created, location: @invoice
    else
      render json: @invoice.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /invoices/1
  def update
    if @invoice.update(invoice_params)
      render json: @invoice
    else
      render json: @invoice.errors, status: :unprocessable_entity
    end
  end

  # DELETE /invoices/1
  def destroy
    @invoice.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = Invoice.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def invoice_params
      params.require(:invoice).permit(:Type, :Status, :Payment_Status, :Payment_Type, :Commission_Paid, :Check_Info, :Discount, :Tip, :Refund, :event_id)
    end
end
