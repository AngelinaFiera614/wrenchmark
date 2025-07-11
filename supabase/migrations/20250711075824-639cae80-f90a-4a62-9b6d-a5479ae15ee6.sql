-- Fix the power_to_weight_ratio column by removing the generated expression
-- This will allow us to update it manually through our application logic

ALTER TABLE motorcycle_models 
ALTER COLUMN power_to_weight_ratio DROP EXPRESSION;