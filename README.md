# Server-Sent Events Demo

Welcome to the Server-Sent Events Demo! This Node.js application showcases the implementation of Server-Sent Events (SSE) in various scenarios. SSE is a simple and efficient way to send real-time updates from the server to the client over HTTP, allowing seamless communication without the need for continuous requests.
Table of Contents

## Introduction

Server-Sent Events (SSE) is a technology that enables the server to push real-time updates to connected clients over a single HTTP connection. This project demonstrates the capabilities of SSE in different scenarios. It includes a landing page that serves as the entry point to three other pages, each showcasing a unique SSE application.

## Usage

To start the server, first clone the repo, then run the following command: `npm install && npm start`

The application will be accessible at http://localhost:3000/ by default.

## Pages

1. Landing Page  
The landing page serves as the main entry point to the various SSE demonstrations. It provides links to the other three pages:  
  * Server Time Application
  * Chat Application
  * Billboard Page

2. Server Time Application  
The Server Time Application demonstrates how SSE can be used to determine the time delay between the server and the client. The server continuously sends the current time to the client, which calculates the time difference and displays it on the page.

3. Chat Application  
The Chat Application showcases how forms can be used to send messages to the server, and SSE is utilized to receive these messages on the client side. Users can send messages in real-time, and they will be instantly displayed on the page as they are received from the server.

4. Billboard Page  
The Billboard Page simulates how SSE can be employed to power a dynamic billboard on the side of the road. It automatically advances to the next billboard content every 5 seconds, providing a seamless and real-time display experience.

