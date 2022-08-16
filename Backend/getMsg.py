import sys
from app import chatbot_response
msg=sys.argv[1]
output = chatbot_response(msg)
print(output)
  
