Table students {
  student_id int [pk, increment]
  student_name varchar
  created_at timestamp
}

Table submissions {
  submission_id int [pk, increment]
  student_id int [ref: > students.student_id]
  component_type varchar
  submit_text text
  score int
  feedback text
  highlights jsonb
  highlight_submit_text text
  status varchar
  created_at timestamp
  updated_at timestamp
}

Table submission_media {
  media_id int [pk, increment]
  submission_id int [ref: > submissions.submission_id]
  video_url varchar
  audio_url varchar
  video_file_name varchar
  audio_file_name varchar
  created_at timestamp
}

Table submission_logs {
  log_id int [pk, increment]
  submission_id int [ref: > submissions.submission_id]
  trace_id varchar
  latency int
  result varchar
  message text
  created_at timestamp
}

Table revisions {
  revision_id int [pk, increment]
  submission_id int [ref: > submissions.submission_id]
  score int
  feedback text
  highlights jsonb
  created_at timestamp
}

Table stats_daily {
  id int [pk, increment]
  date date
  total_count int
  success_count int
  fail_count int
}

Table stats_weekly {
  id int [pk, increment]
  date date
  total_count int
  success_count int
  fail_count int
}

Table stats_monthly {
  id int [pk, increment]
  date date
  total_count int
  success_count int
  fail_count int
}
