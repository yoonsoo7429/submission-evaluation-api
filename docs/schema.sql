-- students 테이블
CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- submissions 테이블
CREATE TABLE submissions (
  submission_id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  component_type VARCHAR(255) NOT NULL,
  submit_text TEXT NOT NULL,
  score INT,
  feedback TEXT,
  highlights JSONB,
  highlight_submit_text TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- submission_media 테이블
CREATE TABLE submission_media (
  media_id SERIAL PRIMARY KEY,
  submission_id INT NOT NULL,
  video_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  video_file_name VARCHAR(255),
  audio_file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_id)
);

-- submission_logs 테이블
CREATE TABLE submission_logs (
  log_id SERIAL PRIMARY KEY,
  submission_id INT NOT NULL,
  trace_id UUID NOT NULL,
  latency INT,
  result VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_id)
);

-- revisions 테이블
CREATE TABLE revisions (
  revision_id SERIAL PRIMARY KEY,
  submission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_id)
);
