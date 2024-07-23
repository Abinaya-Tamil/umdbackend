const pool = require('./db');

// Function to get data from a specific table
async function getData(tableName) {
    if (!tableName || typeof tableName !== 'string') {
        throw new Error('Invalid table name');
    }
    
    // Ensure tableName is sanitized if using directly in SQL
    const allowedTables = [
        'badge', 'das_factsheet_config_tbl', 'data_profile_column', 'data_profile_datatype',
        'data_profile_pattern', 'data_profile_statistics', 'data_profile_values', 'datatopic',
        'ds_restriction_rule_mgmt', 'factsheet_detail', 'factsheet_master', 'holidaycalendar_pmi',
        'metadata_attributes', 'operational_metadata', 'operationaldata', 'rc_rl_template',
        'service_level_badge', 'service_level_badge1', 'service_level_metric', 
        'service_level_metric_master', 'service_level_metrics', 'target_mapping'
    ];
    
    if (!allowedTables.includes(tableName)) {
        throw new Error(`Table ${tableName} is not allowed`);
    }
    
    try {
        const [results] = await pool.query('SELECT * FROM ??', [tableName]);
        return results;
    } catch (err) {
        throw new Error(`Error retrieving data from ${tableName}: ${err.message}`);
    }
}

module.exports = { getData };
