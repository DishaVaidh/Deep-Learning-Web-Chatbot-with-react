import random
import json
import pymongo
import torch
from flask import Flask, render_template, request
from flask_cors import CORS,cross_origin
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize
import sys

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

"""with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)"""

myclient = pymongo.MongoClient("mongodb://localhost:27017")
mydb = myclient["React_Chatbot_db"]
mycol = mydb["test"]
intents = mycol.find_one()

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Bot"
#print("Let's chat! (type 'quit' to exit)")
"""while True:
    # sentence = "do you use credit cards?"
    sentence = input("You: ")
    if sentence == "quit":
        break

    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                print(f"{bot_name}: {random.choice(intent['responses'])}")
    else:
        print(f"{bot_name}: I do not understand...")"""

def chatbot_response(sentence):
    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                #print(f"{bot_name}: {random.choice(intent['responses'])}")
                ans = random.choice(intent['responses'])
                return ans
    else:
        return ("I do not understand...")

"""
app = Flask(__name__)
CORS(app,resources={r"/api/*":{"origins":"*"}})
app.config['CORS HEADERS'] = "Content-Type"
app.static_folder = 'static'

@app.route("/")
@cross_origin()
def home():
    return "Hello flask"
    
@app.route("/get")
@cross_origin()
def get_bot_response():
    userText = request.args.get('msg')
    return chatbot_response(userText)

@app.route("/getData")
@cross_origin()
def get_patterns():
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["React_Chatbot_db"]
    col = mydb["test"]
    intents = col.find_one()
    data1=[]
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            data1.append(pattern)
    return {"data":data1}


if __name__ == "__main__":
    app.run()
    """