import pymongo
myclient = pymongo.MongoClient("mongodb+srv://new-user1:SptGo9T4Kg4W9PbL@cluster0.mp33i.mongodb.net/logistiexdb?retryWrites=true")
mydb = myclient["logistiexdb"]
mycol = mydb["Chatbot_db"]

intents = mycol.find_one()
print(intents['intents'])