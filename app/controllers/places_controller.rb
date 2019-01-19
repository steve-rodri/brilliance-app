class PlacesController < ApplicationController
  before_action :set_place, only: [:show, :update, :destroy]

  # GET /places
  def index
    @places = Place.all

    render json: @places
  end

  # GET /places/1
  def show
    render json: @place
  end

  # POST /places
  def create
    @place = Place.new(place_params)

    if @place.save
      render json: @place, status: :created, location: @place
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /places/1
  def update
    if @place.update(place_params)
      render json: @place
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  # DELETE /places/1
  def destroy
    @place.destroy
  end

  # GET /places/find
  def find
    terms = params[:q].split

    name_query = "SELECT * FROM places WHERE name LIKE '%#{params[:q]}%'"
    short_name_query = "SELECT * FROM places WHERE short_name LIKE '%#{params[:q]}%'"

    names = execute_sql(contact_query)
    short_names = execute_sql(company_query)

    places = []
    if places
      names.each do |name|
        short_names.each do |short_name|
          name_id =  name.as_json["id"]
          short_name_id = short_name.as_json["id"]

          if name_id != short_name_id
            places.push(name_id)
          end
        end
      end
    end

    render json: places
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def place_params
      params.require(:place).permit(:installation, :photo, :name, :short_name, :commission)
    end
end
