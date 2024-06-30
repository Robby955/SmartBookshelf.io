from pymongo import MongoClient, errors

def test_mongodb_connection():
    mongo_uri = "mongodb+srv://robbysneiderman:XIiofxici00fRthn@cluster0.qa9ydac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    try:
        # Create a MongoClient
        client = MongoClient(mongo_uri)
        print("Connected to MongoDB")

        # List databases
        databases = client.list_database_names()
        print("Databases:", databases)

        # Access a test database and collection
        db = client.test_database
        collection = db.test_collection

        # Insert a test document
        test_document = {"name": "test_document", "value": 42}
        result = collection.insert_one(test_document)
        print("Inserted document ID:", result.inserted_id)

        # Find the inserted document
        found_document = collection.find_one({"name": "test_document"})
        print("Found document:", found_document)

        # Clean up by deleting the test document
        collection.delete_one({"name": "test_document"})
        print("Deleted test document")

    except errors.ConnectionError as e:
        print(f"Failed to connect to MongoDB: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_mongodb_connection()
