class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :update, :destroy]
  @@items_per_page = 25
  @@date_start = Time.zone.today()
  @@date_end = Time.zone.today()

  # GET /invoices
  def index
    @@date_where = ''
    @@send_count = false
    if params[:date_start] && params[:date_end]
      @@date_start = Time.zone.parse(params[:date_start])
      @@date_end = Time.zone.parse(params[:date_end])
      @@date_where = "events.start BETWEEN '#{@@date_start}' AND '#{@@date_end}'"
    end
    if params[:send_count]
      @@send_count = true
    end

    if params[:category]
      count = 0
      if params[:category] == 'All'
        if @@send_count
          count = Invoice
            .joins(:event)
            .where(@@date_where)
            .size
        end
        @invoices = Invoice
          .joins(:event)
          .where(@@date_where)
          .order("events.start")
          .paginate(page: params[:page], per_page: @@items_per_page)

      elsif params[:category] == 'Production'
        if @@send_count
          count = Invoice
            .joins(:event)
            .where(@@date_where)
            .where("invoices.kind = 'Production Invoice'")
            .size
        end
        @invoices = Invoice
          .joins(:event)
          .where(@@date_where)
          .where("invoices.kind = 'Production Invoice'")
          .order("events.start DESC")
          .paginate(page: params[:page], per_page: @@items_per_page)

      else
        short_name = params[:category]
        if @@send_count
          count = Invoice
            .joins(:event)
            .joins("JOIN places ON places.id = events.location_id")
            .where(@@date_where)
            .where("places.short_name = '#{short_name}'")
            .size
        end
        @invoices = Invoice
          .joins(:event)
          .joins("JOIN places ON places.id = events.location_id")
          .where(@@date_where)
          .where("places.short_name = '#{short_name}'")
          .order("events.start DESC")
          .paginate(page: params[:page], per_page: @@items_per_page)
      end

      if count
        render json: @invoices, meta: { count: count }, include: '**'
      else
        render json: @invoices, include: '**'
      end
    elsif params[:client_id]
      id = params[:client_id]
      count = Invoice
        .joins(event: :client)
        .where(@@date_where)
        .where("clients.id = #{id}")
        .size
      @invoices = Invoice
        .joins(event: :client)
        .where(@@date_where)
        .where("clients.id = #{id}")
        .order("events.start DESC")
        .paginate(page: params[:page], per_page: @@items_per_page)

      if count
        render json: @invoices, meta: { count: count }, include: '**'
      else
        render json: @invoices, include: '**'
      end
    elsif params[:q]
      count = 0
      page_num = params[:page].to_i
      offset = ( page_num - 1 ) * @@items_per_page

      query = "SELECT DISTINCT invoices.*, events.start
      FROM invoices
      LEFT OUTER JOIN lines ON lines.invoice_id = invoices.id
      LEFT OUTER JOIN items ON lines.item_id = items.id
      LEFT OUTER JOIN item_contents ON item_contents.item_id = items.id
      LEFT OUTER JOIN contents ON item_contents.content_id = contents.id
      LEFT OUTER JOIN inventories ON inventories.id = contents.inventory_id
      LEFT OUTER JOIN events ON events.id = invoices.event_id
      LEFT OUTER JOIN clients ON clients.id = events.client_id
      LEFT OUTER JOIN companies ON companies.id = clients.company_id
      LEFT OUTER JOIN event_employees ON event_employees.event_id = events.id
      LEFT OUTER JOIN employees ON employees.id = event_employees.employee_id
      LEFT OUTER JOIN contacts clients_contacts ON clients_contacts.id = clients.contact_id
      LEFT OUTER JOIN contacts employees_contacts ON  employees_contacts.id = employees.contact_id
      LEFT OUTER JOIN email_addresses clients_email_addresses ON clients_email_addresses.contact_id = clients_contacts.id
      LEFT OUTER JOIN email_addresses employees_email_addresses ON employees_email_addresses.contact_id = employees_contacts.id
      LEFT OUTER JOIN places places_location ON places_location.id = events.location_id
      LEFT OUTER JOIN places places_call_location ON places_call_location.id = events.call_location_id
      WHERE "

      terms = params[:q].split
      terms.each do |term|
        query += "(invoices.kind LIKE '%#{term.capitalize}%'
        OR invoices.payment_status LIKE '%#{term.capitalize}%'
        OR invoices.payment_type LIKE '%#{term.capitalize}%'
        OR items.kind LIKE '%#{term.capitalize}%'
        OR items.install LIKE '%#{term.capitalize}%'
        OR items.description LIKE '%#{term.capitalize}%'
        OR contents.kind LIKE '%#{term.capitalize}%'
        OR contents.description LIKE '%#{term.capitalize}%'
        OR inventories.category LIKE '%#{term.capitalize}%'
        OR inventories.name LIKE '%#{term.capitalize}%'
        OR inventories.manufacturer LIKE '%#{term.capitalize}%'
        OR clients_contacts.first_name LIKE '%#{term.capitalize}%'
        OR clients_contacts.last_name LIKE '%#{term.capitalize}%'
        OR employees_contacts.first_name LIKE '%#{term.capitalize}%'
        OR employees_contacts.last_name LIKE '%#{term.capitalize}%'
        OR companies.name LIKE '%#{term.capitalize}%'
        OR events.action LIKE '%#{term.capitalize}%'
        OR events.kind LIKE '%#{term.capitalize}%'
        OR events.description LIKE '%#{term.capitalize}%'
        OR events.tags LIKE '%#{term.capitalize}%'
        OR events.summary LIKE '%#{term.capitalize}%'
        OR events.summary LIKE '%#{term}%'
        OR places_location.name LIKE '%#{term.capitalize}%'
        OR places_location.short_name LIKE '%#{term}%'
        OR places_location.short_name LIKE '%#{term.upcase}%'
        OR places_call_location.name LIKE '%#{term.capitalize}%'
        OR places_call_location.short_name LIKE '%#{term}%'
        OR places_call_location.short_name LIKE '%#{term.upcase}%'
        OR clients_email_addresses.email_address LIKE '%#{term.downcase}%'
        OR clients_email_addresses.email_address LIKE '%#{term}%'
        OR employees_email_addresses.email_address LIKE '%#{term.downcase}%'
        OR employees_email_addresses.email_address LIKE '%#{term}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end

      query += " #{@@date_where}"

      if @@send_count
        count = Invoice.find_by_sql(query).size
      end

      query += " ORDER BY events.start"
      query += " OFFSET #{offset} ROWS"
      query += " FETCH NEXT #{@@items_per_page} ROWS ONLY"

      @invoices = Invoice.find_by_sql(query)

      if count
        render json: @invoices, root:"invoices", meta: { count: count }, include: '**'
      else
        render json: @invoices, root:"invoices", include: '**'
      end
    else
    count = 0
    if @@send_count
      count = Invoice
        .joins(:event)
        .where(@@date_where)
        .size
    end

    @invoices = Invoice
      .joins(:event)
      .where(@@date_where)
      .order("events.start")
      .paginate(page: params[:page], per_page: @@items_per_page)

    if count
      render json: @invoices, meta: { count: count }, include: '**'
    else
      render json: @invoices, include: '**'
    end
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
