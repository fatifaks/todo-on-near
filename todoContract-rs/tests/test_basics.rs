use serde_json::json;

#[tokio::test]
async fn test_contract_is_operational() -> Result<(), Box<dyn std::error::Error>> {
    let contract_wasm = near_workspaces::compile_project("./").await?;

    test_basics_on(&contract_wasm).await?;
    Ok(())
}

async fn test_basics_on(contract_wasm: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let sandbox = near_workspaces::sandbox().await?;
    let contract = sandbox.dev_deploy(contract_wasm).await?;

    let user_account = sandbox.dev_create_account().await?;

    let outcome = user_account
        .call(contract.id(), "add_task")
        .args_json(json!({"title": "Buy groceries"}))
        .transact()
        .await?;
    assert!(outcome.is_success());

    let tasks_outcome = contract.view("list_tasks").args_json(json!({})).await?;
    let tasks: Vec<serde_json::Value> = tasks_outcome.json()?;
    assert_eq!(tasks.len(), 1);
    assert_eq!(tasks[0]["title"], "Buy groceries");
    assert_eq!(tasks[0]["completed"], false);

    let task_id = tasks[0]["id"].as_u64().unwrap();

    let toggle_outcome = user_account
        .call(contract.id(), "toggle_task")
        .args_json(json!({"task_id": task_id}))
        .transact()
        .await?;
    assert!(toggle_outcome.is_success());

    let tasks_after_toggle = contract.view("list_tasks").args_json(json!({})).await?;
    let tasks: Vec<serde_json::Value> = tasks_after_toggle.json()?;
    assert_eq!(tasks[0]["completed"], true);

    let delete_outcome = user_account
        .call(contract.id(), "delete_task")
        .args_json(json!({"task_id": task_id}))
        .transact()
        .await?;
    assert!(delete_outcome.is_success());

    let tasks_after_delete = contract.view("list_tasks").args_json(json!({})).await?;
    let tasks: Vec<serde_json::Value> = tasks_after_delete.json()?;
    assert_eq!(tasks.len(), 0);

    Ok(())
}


