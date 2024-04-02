from flask import Flask, jsonify, request
import zulip

client = zulip.Client(config_file="zuliprc")
app = Flask(__name__)


@app.route("/")
def home():
    return jsonify(ok=True)


@app.route("/api/ping")
def ping():
    return jsonify(message="pong")


@app.route("/api/subscriptions")
def subscriptions():
    subscriptions = client.get_subscriptions()

    return jsonify(data=subscriptions)


@app.route("/api/users/<id>")
def users(id):
    # user_id = request.args.get("user_id", 690086)  # me
    user = client.get_user_by_id(id)

    return jsonify(data=user)


@app.route("/api/topics")
def topics():
    stream_id = request.args.get("stream_id", 18961)  # checkins
    topics = client.get_stream_topics(stream_id)

    return jsonify(data=topics)


@app.route("/api/messages")
def messages():
    stream = request.args.get("stream", "checkins")
    topic = request.args.get("topic", "Alex Reichert")
    # stream/18961-checkins/topic/Alex.20Reichert
    params = {
        "anchor": "newest",
        "num_before": 100,
        "num_after": 0,
        "narrow": [
            # {"operator": "stream", "operand": "checkins"},
            # {"operator": "topic", "operand": "Alex Reichert"},
            {"operator": "stream", "operand": stream},  # NB: must be number if using ID
            {"operator": "topic", "operand": topic},
        ],
    }
    messages = client.get_messages(params)

    return jsonify(data=messages)


if __name__ == "__main__":
    app.run(port=3002, debug=True)
