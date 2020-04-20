class GoogleEventsController < ApplicationController
@@event_sync_params = {}

  def update
    @events = []
    if params[:events]
      params[:events].each do |event|
        set_google_event_params(event)
        if @event && @event.update(@@event_sync_params)
          @events.push(@event)
        end
      end
      render json: @events, include: "**"
    end
  end

  private

  def set_google_event_params(event)
    @@event_sync_params[:gc_id] = event[:id]
    @@event_sync_params[:gc_i_cal_uid] = event[:i_cal_u_i_d]

    #initialize event
    if event[:organizer][:email] == params[:admin_calendar_id]
      @event = Event.find_or_create_by gc_i_cal_uid: @@event_sync_params[:gc_i_cal_uid]
    end
    if event[:start][:date]
      @@event_sync_params[:start] = Time.zone.parse(event[:start][:date])
    elsif event[:start][:date_time]
      @@event_sync_params[:start] = Time.zone.parse(event[:start][:date_time])
    end
    if event[:end][:date]
      @@event_sync_params[:end] = Time.zone.parse(event[:end][:date])
    elsif event[:end][:date_time]
      @@event_sync_params[:end] = Time.zone.parse(event[:end][:date_time])
    end

    @@event_sync_params[:summary] = event[:summary]
    @@event_sync_params[:html_link] = event[:html_link]


    if event[:status]
      case event[:status]
      when "tentative"
        @@event_sync_params[:confirmation] = "Unconfirmed"
      when "confirmed"
        @@event_sync_params[:confirmation] = "Confirmed"
      when "cancelled"
        @@event_sync_params[:confirmation] = "Cancelled"
      end
    end

    if event[:attendees]
      event[:attendees].each do | attendee_params |
        # email, displayName, responseStatus
        worker = EventEmployee
          .joins(:event, employee: { contact: :email_address } )
          .find_by(
            "
            event_employees.event_id = events.id
            AND email_addresses.email_address
            LIKE '%#{attendee_params[:email].downcase}%'
            "
          )
        if worker
          worker.update(confirmation: attendee_params[:response_status])
        else
          emailAddress = EmailAddress.find_by(email_address: attendee_params[:email])
          if emailAddress
            emailAddress.update(notifications: true)
          else
            emailAddress = EmailAddress.create(email_address: attendee_params[:email], notifications: true)
          end

          if emailAddress.contact && emailAddress.contact.employee
            emailAddress.contact.employee.event_employees.create(
              confirmation: attendee_params[:response_status],
            )

          elsif emailAddress.contact
            employee = emailAddress.contact.create_employee(active: true)
            employee.event_employees.create(
              confirmation: attendee_params[:response_status],
              event_id: @event[:id]
            )

          else
            if attendee_params[:display_name]
              contact = emailAddress.create_contact(
                first_name: attendee_params[:display_name].split(' ')[0],
                last_name: attendee_params[:display_name].split(' ')[1]
              )
            else
              contact = emailAddress.create_contact()
            end
            employee = contact.create_employee(
              active: true
            )
            employee.event_employees.create(
              confirmation: attendee_params[:response_status],
              event_id: @event[:id]
            )
          end
        end
      end
    end

    if event[:creator]
      emailAddress = EmailAddress.find_or_create_by(
        email_address: event[:creator][:email]
      )
      if emailAddress.contact
        contact = emailAddress.contact
      elsif event[:creator][:display_name]
        contact = emailAddress.create_contact(
          first_name: event[:creator][:display_name].split(' ')[0],
          last_name: event[:creator][:display_name].split(' ')[1]
        )
      else
        contact = emailAddress.create_contact()
      end
      @@event_sync_params[:creator_id] = contact[:id]
    end

    if event[:description]
      spacer = "***************************************";
      subsection = event[:description].include? spacer;
      if subsection
        length = "#{spacer}\n\n".length;
        i = event[:description].index(spacer);
        notes = event[:description].slice(i + length);
        @@event_sync_params[:notes] = notes;
      else
        @@event_sync_params[:notes] = event[:description];
      end
    end
  end

# params.permit(
#   :name,
#   { emails: [] },
#   friends: [
#     :name,
#     { family: [ :name ],
#       hobbies: []
#     }
#   ]
# )
# {
#   "id": string,
#   "status": string,
#   "htmlLink": string,
#   "created": datetime,
#   "updated": datetime,
#   "summary": string,
#   "description": string,
#   "location": string,
#   "creator": {
#     "id": string,
#     "email": string,
#     "displayName": string,
#     "self": boolean
#   },
#   "organizer": {
#     "id": string,
#     "email": string,
#     "displayName": string,
#     "self": boolean
#   },
#   "start": {
#     "date": date,
#     "dateTime": datetime,
#     "timeZone": string
#   },
#   "end": {
#     "date": date,
#     "dateTime": datetime,
#     "timeZone": string
#   },
#   "endTimeUnspecified": boolean,
#   "recurrence": [
#     string
#   ],
#   "recurringEventId": string,
#   "originalStartTime": {
#     "date": date,
#     "dateTime": datetime,
#     "timeZone": string
#   },
#   "transparency": string,
#   "visibility": string,
#   "iCalUID": string,
#   "sequence": integer,
#   "attendees": [
#     {
#       "id": string,
#       "email": string,
#       "displayName": string,
#       "organizer": boolean,
#       "self": boolean,
#       "resource": boolean,
#       "optional": boolean,
#       "responseStatus": string,
#       "comment": string,
#       "additionalGuests": integer
#     }
#   ],
#   "attendeesOmitted": boolean,
#   "hangoutLink": string,
#   "conferenceData": {
#     "createRequest": {
#       "requestId": string,
#       "conferenceSolutionKey": {
#         "type": string
#       },
#       "status": {
#         "statusCode": string
#       }
#     },
#     "entryPoints": [
#       {
#         "entryPointType": string,
#         "uri": string,
#         "label": string,
#         "pin": string,
#         "accessCode": string,
#         "meetingCode": string,
#         "passcode": string,
#         "password": string
#       }
#     ],
#     "conferenceSolution": {
#       "key": {
#         "type": string
#       },
#       "name": string,
#       "iconUri": string
#     },
#     "conferenceId": string,
#     "signature": string,
#     "notes": string,
#     "gadget": {
#     "type": string,
#     "title": string,
#     "link": string,
#     "iconLink": string,
#     "width": integer,
#     "height": integer,
#     "display": string,
#   },
#   "anyoneCanAddSelf": boolean,
#   "guestsCanInviteOthers": boolean,
#   "guestsCanModify": boolean,
#   "guestsCanSeeOtherGuests": boolean,
#   "privateCopy": boolean,
#   "locked": boolean,
#   "reminders": {
#     "useDefault": boolean,
#     "overrides": [
#       {
#         "method": string,
#         "minutes": integer
#       }
#     ]
#   },
#   "source": {
#     "url": string,
#     "title": string
#   },
#   "attachments": [
#     {
#       "fileUrl": string,
#       "title": string,
#       "mimeType": string,
#       "iconLink": string,
#       "fileId": string
#     }
#   ]
# }
end
