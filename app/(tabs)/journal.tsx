import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type JournalStatus = "ALL" | "WISH_LIST" | "KITTED" | "STARTED" | "FINISHED";

type JournalItem = {
  id: string;
  title: string;
  status: Exclude<JournalStatus, "ALL">;
  imageUrl?: string;
};

const FILTERS: { key: JournalStatus; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "WISH_LIST", label: "Wish List" },
  { key: "KITTED", label: "Kitted" },
  { key: "STARTED", label: "Started" },
  { key: "FINISHED", label: "Finished" },
];

// temp fake data – replace with your real data later
const MOCK_ITEMS: JournalItem[] = [
  {
    id: "1",
    title: "Butterfly",
    status: "WISH_LIST",
  },
  {
    id: "2",
    title: "Gathering The Greens",
    status: "WISH_LIST",
  },
];

export default function JournalScreen() {
  const [activeFilter, setActiveFilter] = useState<JournalStatus>("ALL");
  const [searchText, setSearchText] = useState("");

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const matchesFilter =
        activeFilter === "ALL" || item.status === activeFilter;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchText.toLowerCase().trim());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchText]);

  return (
    <ThemedView style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <ThemedText type="title" style={styles.headerTitle}>
          Journal
        </ThemedText>

        <View style={styles.headerIcons}>
          <Ionicons name="funnel-outline" size={22} style={styles.headerIcon} />
          <Ionicons name="grid-outline" size={22} style={styles.headerIcon} />
          <Ionicons name="add" size={26} style={styles.headerIcon} />
        </View>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        {FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <ThemedText
                style={[
                  styles.filterLabel,
                  isActive && styles.filterLabelActive,
                ]}
              >
                {filter.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* Search box */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} style={styles.searchIcon} />
        <TextInput
          placeholder="Enter search keywords"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* List / empty state */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No journal items found. Use + button to add.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardText}>
                <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>
                  {prettyStatus(item.status)}
                </ThemedText>
              </View>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

function prettyStatus(status: JournalItem["status"]): string {
  switch (status) {
    case "WISH_LIST":
      return "Wish List";
    case "KITTED":
      return "Kitted";
    case "STARTED":
      return "Started";
    case "FINISHED":
      return "Finished";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 10,
  },
  filterBar: {
    flexDirection: "row",
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#222",
  },
  filterChipActive: {
    backgroundColor: "#f0f0f0",
  },
  filterLabel: {
    fontSize: 14,
  },
  filterLabelActive: {
    color: "#000",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    backgroundColor: "#111",
  },
  searchIcon: {
    marginRight: 6,
    color: "#888",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#121212",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardText: {
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
});
