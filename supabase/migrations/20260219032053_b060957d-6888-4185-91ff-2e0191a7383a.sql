
-- Limpar dados de teste, respeitando dependências (ordem correta)

-- Dependentes primeiro
TRUNCATE TABLE request_messages CASCADE;
TRUNCATE TABLE payment_receipts CASCADE;
TRUNCATE TABLE partnership_usage CASCADE;
TRUNCATE TABLE credit_limits CASCADE;
TRUNCATE TABLE collaborator_documents CASCADE;
TRUNCATE TABLE driver_commissions CASCADE;
TRUNCATE TABLE pix_charges CASCADE;
TRUNCATE TABLE pix_events CASCADE;
TRUNCATE TABLE delivery_orders CASCADE;
TRUNCATE TABLE alert_comments CASCADE;
TRUNCATE TABLE asset_status_history CASCADE;
TRUNCATE TABLE maintenance_schedules CASCADE;
TRUNCATE TABLE inventory_items CASCADE;
TRUNCATE TABLE alerts CASCADE;
TRUNCATE TABLE assets CASCADE;

-- Principais
TRUNCATE TABLE benefit_requests CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE logs CASCADE;
TRUNCATE TABLE user_module_permissions CASCADE;
TRUNCATE TABLE user_unit_access CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE drivers CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE company_pix_settings CASCADE;
TRUNCATE TABLE companies CASCADE;
TRUNCATE TABLE partnerships CASCADE;
TRUNCATE TABLE holidays CASCADE;
TRUNCATE TABLE integration_settings CASCADE;
TRUNCATE TABLE sla_configs CASCADE;
TRUNCATE TABLE system_config CASCADE;
TRUNCATE TABLE pix_orders CASCADE;

-- Profiles por último (referenciado por muitas tabelas)
TRUNCATE TABLE profiles CASCADE;

-- Unidades (base da hierarquia)
TRUNCATE TABLE units CASCADE;
