import { OllamaEmbeddings } from "@langchain/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "langchain/document";
import { Logger } from "@/utils/logger";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const logger = new Logger("rag");

/**
 * Service for handling Retrieval-Augmented Generation (RAG) functionalities.
 * This service is responsible for processing local documents, creating vector embeddings,
 * and retrieving relevant context to be injected into the assistant's prompt.
 */
export class RagService {
  /**
   * Retrieves relevant context from documents in a specified directory based on a user query.
   * @param contextPath - The path to the directory containing the context documents.
   * @param additionalContext - Additional context to be used in the retrieval process.
   * @param query - The user's query to find relevant context for.
   * @returns A string containing the relevant context, or an empty string if an error occurs.
   */
  async getContext(
    contextPath: string | undefined,
    additionalContext: string,
    query: string
  ): Promise<string> {
    try {
      const retriever = await this.getRetriever(contextPath, additionalContext);
      const context = await retriever.invoke(query);
      logger.log("Context retrieved");

      const contextString = context
        .map((doc: any) => doc.pageContent)
        .join("\n\n--------------------\n\n");

      return contextString;
    } catch (error) {
      logger.error("Error getting context:", error);
      return "";
    }
  }

  /**
   * Creates a retriever for a given directory path.
   * This involves loading documents, splitting them into chunks, creating embeddings,
   * and setting up a vector store for retrieval.
   * @param contextPath - The path to the directory containing the context documents.
   * @returns A retriever instance.
   */
  async getRetriever(
    contextPath: string | undefined,
    additionalContext: string
  ): Promise<any> {
    let docs: Document[] = [];

    // If a context path is provided, load documents from it
    if (contextPath) {
      // Load documents from the specified directory, supporting .txt and .md files.
      const directoryLoader = new DirectoryLoader(contextPath, {
        ".txt": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
      });

      logger.log("Loading documents...");
      docs = await directoryLoader.load();
      logger.log("Documents loaded: ", docs.length);
    }

    // Add additional context to the documents
    docs.push(new Document({ pageContent: additionalContext }));

    // Split the documents into smaller chunks for more effective embedding and retrieval.
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);
    logger.log("Splits created: ", splits.length);

    // Create embeddings for the document chunks using a local Ollama model.
    const embeddings = new OllamaEmbeddings({
      model: import.meta.env.VITE_OLLAMA_EMBEDDINGS_MODEL,
    });
    logger.log("Embeddings created");

    // Create a FAISS vector store from the document splits and embeddings.
    // FAISS is a library for efficient similarity search and clustering of dense vectors.
    logger.log("Creating vector store...");
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      embeddings
    );
    logger.log("Vector store created");

    // Create a retriever from the vector store to fetch relevant documents.
    logger.log("Creating retriever...");
    const retriever = vectorStore.asRetriever();
    logger.log("Retriever created");

    return retriever;
  }
}
