import zulip

client = zulip.Client(config_file="zuliprc")


def get_messages_by_stream(stream):
    request: Dict[str, Any] = {
        "anchor": "newest",
        "num_before": 100,
        "num_after": 0,
        "narrow": [
            {"operator": "stream", "operand": stream},
        ],
    }

    return client.get_messages(request)


def handle_response(msg):
    print("Received message:")
    print(msg)
    print("\n")


# Print every message the current user would receive
# This is a blocking call that will run forever
print("Listening for incoming messages...")
client.call_on_each_message(lambda msg: handle_response(msg))
