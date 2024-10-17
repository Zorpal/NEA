dictionarynumbers = [
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
    "thirteen", "fourteen", "quarter", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
    "twenty one", "twenty two", "twenty three", "twenty four", "twenty five", "twenty six", 
    "twenty seven", "twenty eight", "twenty nine", "half", "thirty one", "thirty two", 
    "thirty three", "thirty four", "thirty five", "thirty six", "thirty seven", "thirty eight", 
    "thirty nine", "forty", "forty one", "forty two", "forty three", "forty four", "forty five", 
    "forty six", "forty seven", "forty eight", "forty nine", "fifty", "fifty one", "fifty two", 
    "fifty three", "fifty four", "fifty five", "fifty six", "fifty seven", "fifty eight", 
    "fifty nine"
]

userinput = "6:34"
splittime = userinput.split(":")
hour = dictionarynumbers[int(splittime[0]) - 1]
minutes = dictionarynumbers[int(splittime[1]) - 1]
if splittime[1] == "00":
    print(f"{hour} o'clock")
if splittime[1] == "30":
    print(f"{minutes} past {hour}")
if int(splittime[1]) < 30:
    print(f"{minutes} minutes past {hour}")
if splittime[1] > "30":
    print(f"{minutes} minutes to {hour}")
