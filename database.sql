CREATE TABLE "tasks"
(
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(80) NOT NULL,
  "details" VARCHAR(256),
  "created" TIMESTAMP DEFAULT DATE_TRUNC('hour', CURRENT_TIMESTAMP),
  "deadline" TIMESTAMP DEFAULT DATE_TRUNC('hour', CURRENT_TIMESTAMP + INTERVAL
  '7 day'),
	"isDone" BOOLEAN DEFAULT FALSE
);

  INSERT
	INTO "tasks"
    ("name", "details")
  VALUES
    ('Garbage', 'Take out the garbage.'),
    ('Mow', 'Mow the lawn and use the weedwhacker this time.'),
    ('Homework', 'Finish the weekend assignment for Prime.'),
    ('Bike Maintenance', 'Wash the bike, clean the chains, tune the shifting, change brakepads.'),
    ('Oil Change - Jess', 'Change the oil in the car, check with Jess if this was done.');
