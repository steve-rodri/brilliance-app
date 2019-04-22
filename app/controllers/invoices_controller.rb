class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :update, :destroy]

  @@items_per_page = 25

  # GET /invoices
  def index
    if params[:category]
      current_time = Time.zone.now()
      current_date = Time.zone.new(current_time.year, current_time.month, current_time.day)
      if params[:category] == 'Upcoming'
        @invoices = Invoice
          .joins(:event)
          .where("events.start >= '#{current_date}'")
          .order("events.start")
          .paginate(page: params[:page], per_page: @@items_per_page)

      elsif params[:category] == 'Production'
        @invoices = Invoice
          .joins(:event)
          .where("invoices.kind = 'Production Invoice' AND events.start >= '#{current_date}'")
          .order("events.start DESC")
          .paginate(page: params[:page], per_page: @@items_per_page)

      else
        short_name = params[:category]
        @invoices = Invoice
          .joins(:event)
          .joins("JOIN places ON places.id = events.location_id")
          .where("places.short_name = '#{short_name}' AND events.start >= '#{current_date}'")
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

    elsif params[:date]
      start = Time.zone.parse(params[:date])
      @invoices = Invoice
        .joins(:event)
        .where("events.start >= '#{start}'")
        .order("events.start")
        .paginate(page: params[:page], per_page: @@items_per_page)

    elsif params[:date_start] && params[:date_end]
      startDay = Time.zone.parse(params[:date_start])
      endDay = Time.zone.parse(params[:date_end])
      @invoices = Invoice
        .joins(:event)
        .where("events.start BETWEEN '#{startDay}' AND '#{endDay}'")
        .order("events.start")
        .paginate(page: params[:page], per_page: @@items_per_page)

    else
      @invoices = Invoice
        .all
        .joins(:event)
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
        :check_info,
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
