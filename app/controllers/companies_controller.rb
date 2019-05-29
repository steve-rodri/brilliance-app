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
      query = "clients.id IS NULL AND name LIKE '%#{params[:q]}%'
      OR name LIKE '%#{params[:q].capitalize}%'
      OR name LIKE '%#{params[:q].upcase}%'
      OR name LIKE '%#{params[:q].downcase}%'"
      if @@send_count
        count = Company
          .distinct
          .left_outer_joins(:client)
          .where(query)
          .size
      end
      @companies = Company
        .distinct
        .left_outer_joins(:client)
        .where(query)

      render json: @companies, root: 'companies', meta: { count: count }, include: '**'
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
      render json: @company, status: :created, location: @company, include: '**'
    else
      render json: @company.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /companies/1
  def update
    if @company.update(company_params)
      render json: @company, include: '**'
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
      params.require(:company).permit(:Name, :Logo, :Website, :Phone_Number)
    end
end
