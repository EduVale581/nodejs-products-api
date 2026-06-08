export class HealthController {
  async liveness(req, res) {
    return res.status(200).json({
      status: "ok",
    });
  }
}
