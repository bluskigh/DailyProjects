def get_number(title):
    period_index = None
    length = len(title)
    if title[-2] == '.':
        period_index = length-2
    elif title[-3] == '.':
        period_index = length-3
    elif title[-4] == '.':
        period_index = length-4

    period_index -= 1
    if title[period_index]== ')':
        current = None
        number = ''
        period_index -= 1
        while True:
            current = title[period_index]
            if current == '(':
                break
            number = current + number
            period_index -= 1
        # adding one number to it
        return str(int(number)+1)
    else:
        return None

title = "something(21).mp4"
print("Title: {}".format(title))
number = get_number(title)
print("Number: {}".format(number))
