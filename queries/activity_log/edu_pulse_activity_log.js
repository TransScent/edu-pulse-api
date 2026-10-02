let edu_pulse_activity_log_query={
"insert_activity_log":"INSERT INTO ACTIVITY_LOGS (LOG_ID, USER_ID, USER_NAME, ROLE, ACTION, IP_ADDRESS, TIMESTAMP, DETAILS) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)"
}

module.exports={edu_pulse_activity_log_query}