use actix_web::web::{self, ServiceConfig};

mod handlers;

pub fn config(cfg: &mut ServiceConfig) {
    cfg.service(web::scope("/api").service(handlers::health_check));
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{http, test, App};

    #[actix_rt::test]
    async fn test_config() {
        let app = test::init_service(App::new().configure(config)).await;

        let health_check_req = test::TestRequest::get().uri("/api/health").to_request();

        let health_check_resp = test::call_service(&app, health_check_req).await;

        assert_eq!(health_check_resp.status(), http::StatusCode::OK);
    }
}
