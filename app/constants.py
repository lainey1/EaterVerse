# Define common time range for the dropdowns
def generate_time_choices():
    times = [('Closed', 'Closed')]
    periods = ['AM', 'PM']

    for period in periods:
        for hour in range(1, 13):  # 1-12
            for minute in ['00', '15', '30', '45']:
                time_str = f'{hour}:{minute} {period}'
                times.append((time_str, time_str))

    # Sort times in chronological order
    def time_sort_key(time_tuple):
        if time_tuple[0] == 'Closed':
            return -1  # Put 'Closed' first

        time_str = time_tuple[0]
        hour, rest = time_str.split(':')
        minute, period = rest.split()
        hour = int(hour)

        # Convert to 24 hour format for sorting
        if period == 'PM' and hour != 12:
            hour += 12
        elif period == 'AM' and hour == 12:
            hour = 0

        return hour * 60 + int(minute)

    sorted_times = sorted(times[1:], key=time_sort_key)  # Sort all except 'Closed'
    return [times[0]] + sorted_times  # Put 'Closed' back at the start

TIME_CHOICES = generate_time_choices()

POPULAR_CUISINES = [
    ('American'),
    ('African'),
    ('Chinese'),
    ('French'),
    ('Greek'),
    ('Indian'),
    ('Italian'),
    ('Japanese'),
    ('Korean'),
    ('Mediterranean' ),
    ('Mexican',),
    ('Middle Eastern'),
    ('Spanish'),
    ('Thai'),
    ('Vietnamese'),
    ('Other'),
]
