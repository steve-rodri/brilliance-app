class EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /employees
  def index
    @employees = Employee.search(search_params)
    render json: @employees, include: '**'
  end

  # GET /employees/1
  def show
    render json: @employee, include: '**'
  end

  # POST /employees
  def create
    @employee = Employee.new(employee_params)

    if @employee.save
      render json: @employee, status: :created, location: @employee
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /employees/1
  def update
    if @employee.update(employee_params)
      render json: @employee
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  # DELETE /employees/1
  def destroy
    @employee.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_employee
      @employee = Employee.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def employee_params
      params.require(:employee).permit(:active, :labor, :rate_hand_per_job, :rate_full_job, :rate_on_premise_one_man, :rate_on_premise, :rate_hourly, :rate_hourly_office_shop, :rate_demo, :email, :contact_id)
    end

    def search_params
      params.permit(:active, :labor, :q, :email)
    end
end
