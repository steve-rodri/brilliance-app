class EventEmployeesController < ApplicationController
  before_action :set_event_employee, only: [:show, :update, :destroy]

  # GET /event_employees
  def index
    @event_employees = EventEmployee.all

    render json: @event_employees, include: '**'
  end

  # GET /event_employees/1
  def show
    render json: @event_employee, include: '**'
  end

  # POST /event_employees
  def create
    @event_employee = EventEmployee.new(event_employee_params)

    if @event_employee.save
      render json: @event_employee, status: :created, location: @event_employee, include: '**'
    else
      render json: @event_employee.errors, status: :unprocessable_entity, include: '**'
    end
  end

  # PATCH/PUT /event_employees/1
  def update
    if @event_employee.update(event_employee_params)
      render json: @event_employee
    else
      render json: @event_employee.errors, status: :unprocessable_entity, include: '**'
    end
  end

  # DELETE /event_employees/1
  def destroy
    @event_employee.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event_employee
      @event_employee = EventEmployee.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def event_employee_params
      params.require(:event_employee).permit(:confirmation, :paid?, :position, :rate, :clock_in, :clock_out, :break_minutes, :break?, :hourly?, :employee_id, :event_id)
    end
end
