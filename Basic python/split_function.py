l="user_id    first_name    last_name    email    phone    verification_key    is_email_verified    is_phone_verified    date_created    estimate_id    user_id    city_type    select_city    moving_from    moving_to    moving_on    distance    duration    property_size    old_floor_no    new_floor_no    old_elevator_availability    packing_service    new_elevator_availability    unpacking_service    old_parking_distance    new_parking_distance    items    total_items    service_type    notification_sent    status    date_created "
l = l.split()
c=1
for i in range(len(l)):
    print(c,l[i])
    c+=1