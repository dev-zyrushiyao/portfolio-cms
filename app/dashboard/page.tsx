"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../services/supabase";
import { User } from "@supabase/supabase-js";
import Navbar from "../components/ui/Navbar";
import Link from "next/link";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import getCategories, { CategoryProp, convertDate } from "../services/category";
import getContacts, {
  ContactProp,
  updateContactRead,
} from "../services/contact";
import ActionMenu from "../components/ui/ActionMenu";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  //fetched data
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<CategoryProp[]>([]);
  const [contact, setContact] = useState<ContactProp[]>([]);

  //currentState
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const filteredContacts = contact.filter(
    (cont) => cont.category_id === selectedCategory,
  );
  const [selectedContact, setSelectedContact] = useState<ContactProp | null>(
    null,
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (!user || error) {
        // Redirect back to home/login if not authenticated
        router.push("/");
      } else {
        setLoggedUser(user);
        setLoading(false);
      }
    });

    async function fetchData(): Promise<void> {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    }
    fetchData();

    async function fetchContact(): Promise<void> {
      const contactData = await getContacts();
      setContact(contactData);
    }
    fetchContact();
  }, [router]);

  //animation
  const container = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP(
    () => {
      const liElem = container.current?.querySelectorAll(
        ".action-list ul > li",
      );

      liElem?.forEach((elem) => {
        const tween = gsap.to(elem, {
          paused: true,
          duration: 0.3,
          borderBottom: "1px solid black",
          color: "#ad8411",
        });

        elem.addEventListener("mouseenter", () => {
          tween.play();
        });
        elem.addEventListener("mouseleave", () => {
          tween.reverse();
        });
      });
    },
    { scope: container, dependencies: [filteredContacts] },
  );

  function handleMouseEnterContact(e: React.MouseEvent): void {
    console.log(e.currentTarget);

    //animation injection
    const context = contextSafe(() => {
      gsap.to(e.currentTarget, {
        color: "#ad8411",
      });
    });

    context();
  }

  function handleMouseLeaveContact(e: React.MouseEvent): void {
    console.log(e.currentTarget);

    //animation injection
    const context = contextSafe(() => {
      gsap.to(e.currentTarget, {
        color: "black",
      });
    });

    context();
  }

  async function handleUpdateReadStatus(
    selectedContact: ContactProp,
  ): Promise<void> {
    const newReadStatus = !selectedContact.read;

    //Update the database
    await updateContactRead(selectedContact.id, selectedContact.read);

    //updates the state of contact (FilteredContact)
    setContact((prevContacts) =>
      prevContacts.map((c) =>
        c.id === selectedContact.id ? { ...c, read: newReadStatus } : c,
      ),
    );

    //updates the mark as read button label
    setSelectedContact((prev) =>
      prev ? { ...prev, read: newReadStatus } : null,
    );
  }

  return (
    <div className="p-8">
      <Navbar loggedUser={loggedUser} />
      <div ref={container} className="wrapper flex flex-row p-5 gap-20">
        <div className="left-wrapper w-100 h-fit bg-gray-200 rounded-xl ">
          <ActionMenu />
        </div>
        <div className="right-wrapper w-full border">
          <div className="right-content w-full">
            <div className="bg-blue-300 p-2 flex flex-row justify-between items-center">
              <h5>Feedback</h5>
              <select
                className="w-50 border rounded-sm p-2 bg-white"
                defaultValue=""
                onChange={(e) => {
                  const categoryId = Number(e.currentTarget.value);
                  setSelectedCategory(categoryId);
                }}
              >
                <option value="" disabled>
                  Select a categories
                </option>
                {categories &&
                  categories?.map((cat) => {
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_type}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="content-wrapper flex flex-row h-200 overflow-hidden">
              <div className="content-list w-100 bg-sky-100 p-5 overflow-y-scroll">
                <ul className="contact-li flex flex-col gap-5">
                  {filteredContacts.length !== 0 ? (
                    filteredContacts.map((elem) => {
                      return (
                        <li
                          key={elem.id}
                          className=" cursor-pointer"
                          onClick={() => {
                            setSelectedContact(elem);
                          }}
                          onMouseEnter={handleMouseEnterContact}
                          onMouseLeave={handleMouseLeaveContact}
                        >
                          <div className="flex flex-row justify-between">
                            {elem.subject.slice(0, 20)}.
                            {elem.read && (
                              <span className="font-semibold">(read)</span>
                            )}
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li>NO DATA</li>
                  )}
                </ul>
              </div>
              <div className="content bg-gray-100 w-full">
                {selectedContact ? (
                  <div className="content-info p-5">
                    <div className="border-b">
                      <div className="flex flex-row justify-between">
                        <h6>{selectedContact.subject}</h6>

                        <PrimaryButton
                          label={
                            selectedContact.read
                              ? "Mark it as  unread"
                              : "Mark it as read"
                          }
                          onClick={() => {
                            handleUpdateReadStatus(selectedContact);
                          }}
                        />
                      </div>

                      <p className="text-sm">
                        Category:
                        <span>
                          {
                            categories.find((cat) => {
                              return cat.id === selectedContact.category_id;
                            })?.category_type
                          }
                        </span>
                      </p>
                      <p className="text-sm">
                        From: {selectedContact.sender_name}
                      </p>
                      <p className="text-sm">
                        Email:{" "}
                        <a
                          href={`mailto:${selectedContact.sender_email}`}
                          target="_blank"
                        >
                          {selectedContact.sender_email}
                        </a>
                      </p>
                      <p className="text-sm">
                        Date: {convertDate(selectedContact.created_at)}
                      </p>
                      <p className="text-sm">Message:</p>
                      <div className="text-content px-5 overflow-y-scroll w-full h-170 p-5 border-2 border-gray-200">
                        <p className="text-xl">{selectedContact.message}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-gray-100 flex flex-col justify-center items-center">
                    <h6>NO DATA TO DISPLAY</h6>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
