class CompaniesController < ApplicationController
  before_action :set_company, only: [:show, :update, :destroy]

  # GET /companies
  def index
    @@send_count = false
    if params[:send_count]
      @@send_count = true
    end

    if params[:q]
      count = 0
      terms = params[:q].split
      query = ""
      terms.each do |term|
        query += "
        (name LIKE '%#{term}%'
        OR name LIKE '%#{term.capitalize}%'
        OR name LIKE '%#{term.upcase}%'
        OR name LIKE '%#{term.downcase}%')"

        if terms.index(term) + 1 < terms.length
          query += " AND "
        end
      end
      if @@send_count
        count = Company
          .distinct
          .where(query)
          .size
      end
      @companies = Company
        .distinct
        .where(query)

      render json: @companies, root: 'companies', meta: { count: count }
    else
      @companies = Company.all
      render json: @companies
    end
  end

  # GET /companies/1
  def show
    render json: @company
  end

  # POST /companies
  def create
    @company = Company.new(company_params)

    if @company.save
      render json: @company, status: :created, location: @company
    else
      render json: @company.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /companies/1
  def update
    if @company.update(company_params)
      render json: @company
    else
      render json: @company.errors, status: :unprocessable_entity
    end
  end

  # DELETE /companies/1
  def destroy
    @company.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_company
      @company = Company.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def company_params
      params.require(:company).permit(
        :name,
        :logo,
        :website,
        :phone_number,
        email_addresses_attributes: [
          :email_address
        ]
      )
    end
end
