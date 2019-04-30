class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :update, :destroy]

  @@items_per_page = 25
  @@date_start = Time.zone.today()
  @@date_end = Time.zone.today()

  # GET /invoices
  def index

    if params[:date_start]
      @@date_start = Time.zone.parse(params[:date_start])
    end

    if params[:date_end]
      @@date_end = Time.zone.parse(params[:date_end])
    end

    if params[:category]
      if params[:category] == 'All'
        @invoices = Invoice
          .joins(:event)
          .where("events.start >= '#{@@date_start}'")
          .order("events.start")
          .paginate(page: params[:page], per_page: @@items_per_page)

      elsif params[:category] == 'Production'
        @invoices = Invoice
          .joins(:event)
          .where("invoices.kind = 'Production Invoice' AND events.start >= '#{@@date_start}'")
          .order("events.start DESC")
          .paginate(page: params[:page], per_page: @@items_per_page)

      else
        short_name = params[:category]
        @invoices = Invoice
          .joins(:event)
          .joins("JOIN places ON places.id = events.location_id")
          .where("places.short_name = '#{short_name}' AND events.start >= '#{@@date_start}'")
          .order("events.start DESC")
          .paginate(page: params[:page], per_page: @@items_per_page)
      end
      
    elsif params[:client_id]
      id = params[:client_id]
      @invoices = Invoice
        .joins(event: :client)
        .where("clients.id = #{id}")
        .order("events.start DESC")
        .paginate(page: params[:page], per_page: @@items_per_page)

    else
      @invoices = Invoice
        .joins(:event)
        .where("events.start BETWEEN '#{@@date_start}' AND '#{@@date_end}'")
        .order("events.start DESC")
        .paginate(page: params[:page], per_page: @@items_per_page)
    end
    render json: @invoices, include: '**'
  end

  # GET /invoices/1
  def show
    render json: @invoice, include: '**'
  end

  # POST /invoices
  def create
    @invoice = Invoice.new(invoice_params)

    if @invoice.save
      render json: @invoice, include: '**', status: :created, location: @invoice
    else
      render json: @invoice.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /invoices/1
  def update
    if @invoice.update(invoice_params)
      render json: @invoice, include: '**'
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
      params.require(:invoice).permit(
        :kind,
        :status,
        :payment_status,
        :payment_type,
        :commission_paid,
        :commission_actual,
        :check,
        :deposit,
        :discount,
        :tip,
        :refund,
        :sub_total,
        :total,
        :balance,
        :event_id,
        :client_id,
        lines_attributes: [
          :id,
          :item_id,
          :inc,
          :inc_in_commission,
          :discount_adj,
          :quantity,
          :price
        ]
      )
    end
end
