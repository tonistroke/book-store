from flask import Flask
from flask_socketio import SocketIO
from difflib import get_close_matches

app = Flask(__name__)
socketio = SocketIO(app)

# Example data (in a real-world app, use a database)
products = [
    "Apple iPhone 14",
    "Samsung Galaxy S23",
    "Google Pixel 7",
    "Sony Xperia 5",
    "OnePlus 11"
]

@socketio.on('search')
def handle_search(query):
    """
    Handle search queries sent by the client.
    """
    if not query:
        return []

    # Perform a search (basic substring match or fuzzy matching)
    results = get_close_matches(query, products, n=5, cutoff=0.3)

    # Emit the results back to the client
    socketio.emit('searchResults', results)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
