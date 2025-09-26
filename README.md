Shipping Date & Holiday-Aware Scheduler
.........................................
This is a backend task using node.js and test the api's in postman

*calculateShippingDate(orderDatetime, holidays) determines the earliest business shipping date for an order based on:
-> Cut-off time
-> Last-Friday rule: If an order is placed on the last Friday of the month after 12:00 PM, shipping is scheduled for the next Monday

*Normal orders:
-> Placed before 12:00 PM and ship in the same day.
-> Placed after 12:00 PM and ship next business day.

*Weekends & holidays: No shipments on Saturday, Sunday, or listed holidays.

**Logic Steps--------

*Parse Input Date
-> Accepts plain dates (2025-09-25).
->Uses Luxon for reliable UTC calculations.

*Helper Functions
->Weekend:true if Saturday or Sunday.
-> Holiday: true if date string matches a supplied holiday.
-> nextBusinessDay: loops forward day-by-day until a non-weekend, non-holiday date is found.

*Last Friday Rule
-> Finds the last day of the month, then subtracts days to locate the final Friday.
-> If the order date matches that Friday and the time is ≥ 12:00, shipping = next Monday.

*Normal Orders
-> If time < 12:00 :ship same day.
-> Else: add one day.

Weekend/Holiday Adjustment
->Pass the tentative ship date to nextBusinessDay to ensure it’s a valid business day.
